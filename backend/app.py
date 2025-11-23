"""
SeAI Flask Backend Application
Provides REST API for image encryption and verification
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv
from encryption import SeAlEncryption
from steganography import ImageSteganography
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Initialize encryption with master key from environment
MASTER_KEY = os.getenv('SEAL_MASTER_KEY', 'default-master-key-change-in-production')
encryption_handler = SeAlEncryption(MASTER_KEY)
stego_handler = ImageSteganography()


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'SeAI API',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/api/embed', methods=['POST'])
def embed_seal():
    """
    Embed SeAl tag into an uploaded image

    Expected form data:
        - image: Image file

    Returns:
        JSON with success status and download URL
    """
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, BMP'}), 400

        # Generate unique filename
        original_filename = secure_filename(file.filename)
        file_ext = original_filename.rsplit('.', 1)[1].lower()
        unique_id = str(uuid.uuid4())
        upload_filename = f"{unique_id}_upload.{file_ext}"
        output_filename = f"{unique_id}_sealed.png"

        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], upload_filename)
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)

        # Save uploaded file
        file.save(upload_path)

        # Check image capacity
        capacity = stego_handler.calculate_capacity(upload_path)
        if capacity < 100:
            os.remove(upload_path)
            return jsonify({'error': 'Image too small for embedding SeAl tag'}), 400

        # Generate encrypted SeAl tag
        metadata = {
            'timestamp': datetime.utcnow().isoformat(),
            'original_filename': original_filename
        }
        encrypted_tag = encryption_handler.generate_seal_tag(str(metadata))

        # Embed tag in image
        success = stego_handler.embed_tag(upload_path, encrypted_tag, output_path)

        if not success:
            os.remove(upload_path)
            return jsonify({'error': 'Failed to embed SeAl tag'}), 500

        # Clean up upload file
        os.remove(upload_path)

        return jsonify({
            'success': True,
            'message': 'SeAl tag successfully embedded',
            'filename': output_filename,
            'download_url': f'/api/download/{output_filename}'
        }), 200

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@app.route('/api/verify', methods=['POST'])
def verify_seal():
    """
    Verify SeAl tag in an uploaded image

    Expected form data:
        - image: Image file to verify

    Returns:
        JSON with verification result
    """
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, BMP'}), 400

        # Generate unique filename for verification
        original_filename = secure_filename(file.filename)
        file_ext = original_filename.rsplit('.', 1)[1].lower()
        unique_id = str(uuid.uuid4())
        verify_filename = f"{unique_id}_verify.{file_ext}"
        verify_path = os.path.join(app.config['UPLOAD_FOLDER'], verify_filename)

        # Save uploaded file
        file.save(verify_path)

        # Extract tag from image
        success, extracted_tag = stego_handler.extract_tag(verify_path)

        # Clean up
        os.remove(verify_path)

        if not success:
            return jsonify({
                'verified': False,
                'message': 'This image was not generated by AI.',
                'details': 'No valid SeAl tag found in the image.'
            }), 200

        # Verify the extracted tag
        is_valid = encryption_handler.verify_seal_tag(extracted_tag)

        if is_valid:
            return jsonify({
                'verified': True,
                'message': 'SeAl tag verified!',
                'details': 'This image contains a valid AI-generated SeAl tag.'
            }), 200
        else:
            return jsonify({
                'verified': False,
                'message': 'This image was not generated by AI.',
                'details': 'SeAl tag found but verification failed.'
            }), 200

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """
    Download processed image

    Args:
        filename: Name of file to download

    Returns:
        File download
    """
    try:
        filename = secure_filename(filename)
        file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)

        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404

        return send_file(file_path, as_attachment=True, download_name=filename)

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@app.route('/api/info', methods=['GET'])
def get_info():
    """Get application information"""
    return jsonify({
        'application': 'SeAI - AI Image Seal Verification System',
        'version': '1.0.0',
        'encryption': 'AES-256-GCM',
        'steganography': 'LSB (Least Significant Bit)',
        'supported_formats': list(ALLOWED_EXTENSIONS),
        'max_file_size_mb': MAX_FILE_SIZE / (1024 * 1024)
    })


@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({'error': 'File too large. Maximum size is 16MB'}), 413


if __name__ == '__main__':
    print("=" * 60)
    print("SeAI Backend Server Starting...")
    print("=" * 60)
    print(f"Encryption: AES-256-GCM")
    print(f"Steganography: LSB Technique")
    print(f"Upload folder: {UPLOAD_FOLDER}")
    print(f"Output folder: {OUTPUT_FOLDER}")
    print("=" * 60)

    app.run(debug=True, host='0.0.0.0', port=5000)
