"""
Steganography Module for SeAI
Handles embedding and extracting encrypted tags in images using LSB technique
"""

from PIL import Image
import numpy as np
from typing import Tuple


class ImageSteganography:
    """Handle embedding and extraction of data in images using LSB steganography"""

    # Magic header to identify SeAl-tagged images
    MAGIC_HEADER = "SEAI"
    HEADER_LENGTH = 4
    LENGTH_BITS = 32  # Store data length in 32 bits

    def __init__(self):
        """Initialize steganography handler"""
        pass

    def _string_to_bits(self, data: str) -> str:
        """
        Convert string to binary representation

        Args:
            data: String to convert

        Returns:
            Binary string representation
        """
        bits = ''.join(format(ord(char), '08b') for char in data)
        return bits

    def _bits_to_string(self, bits: str) -> str:
        """
        Convert binary string back to text

        Args:
            bits: Binary string

        Returns:
            Decoded string
        """
        chars = [bits[i:i+8] for i in range(0, len(bits), 8)]
        return ''.join(chr(int(char, 2)) for char in chars if char)

    def _embed_bits_in_pixels(self, pixels: np.ndarray, bits: str) -> np.ndarray:
        """
        Embed binary data into image pixels using LSB

        Args:
            pixels: Image pixel array
            bits: Binary string to embed

        Returns:
            Modified pixel array
        """
        flat_pixels = pixels.flatten()

        if len(bits) > len(flat_pixels):
            raise ValueError("Image too small to hide the data")

        # Modify LSB of each pixel to embed one bit
        for i, bit in enumerate(bits):
            flat_pixels[i] = (flat_pixels[i] & 0xFE) | int(bit)

        return flat_pixels.reshape(pixels.shape)

    def _extract_bits_from_pixels(self, pixels: np.ndarray, num_bits: int) -> str:
        """
        Extract binary data from image pixels

        Args:
            pixels: Image pixel array
            num_bits: Number of bits to extract

        Returns:
            Extracted binary string
        """
        flat_pixels = pixels.flatten()
        bits = ''.join(str(pixel & 1) for pixel in flat_pixels[:num_bits])
        return bits

    def embed_tag(self, image_path: str, encrypted_tag: str, output_path: str) -> bool:
        """
        Embed encrypted SeAl tag into an image

        Args:
            image_path: Path to input image
            encrypted_tag: Encrypted tag to embed
            output_path: Path to save output image

        Returns:
            True if successful, False otherwise
        """
        try:
            # Open image
            img = Image.open(image_path)

            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')

            # Convert image to numpy array
            pixels = np.array(img)

            # Prepare data: MAGIC_HEADER + length + encrypted_tag
            data_to_hide = self.MAGIC_HEADER + encrypted_tag

            # Convert data to binary
            data_bits = self._string_to_bits(data_to_hide)

            # Add length header (32 bits for data length)
            length_bits = format(len(data_bits), '032b')
            all_bits = length_bits + data_bits

            # Check if image is large enough
            total_pixels = pixels.size
            if len(all_bits) > total_pixels:
                raise ValueError(f"Image too small. Need {len(all_bits)} pixels, have {total_pixels}")

            # Embed bits in pixels
            modified_pixels = self._embed_bits_in_pixels(pixels, all_bits)

            # Create new image from modified pixels
            new_img = Image.fromarray(modified_pixels.astype('uint8'), 'RGB')

            # Save with maximum quality to minimize compression artifacts
            new_img.save(output_path, 'PNG', optimize=False)

            return True

        except Exception as e:
            print(f"Error embedding tag: {str(e)}")
            return False

    def extract_tag(self, image_path: str) -> Tuple[bool, str]:
        """
        Extract encrypted SeAl tag from an image

        Args:
            image_path: Path to image file

        Returns:
            Tuple of (success, encrypted_tag)
        """
        try:
            # Open image
            img = Image.open(image_path)

            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')

            # Convert to numpy array
            pixels = np.array(img)

            # Extract length header (first 32 bits)
            length_bits = self._extract_bits_from_pixels(pixels, self.LENGTH_BITS)
            data_length = int(length_bits, 2)

            # Validate data length
            if data_length <= 0 or data_length > pixels.size - self.LENGTH_BITS:
                return False, "No valid SeAl tag found"

            # Extract data bits
            flat_pixels = pixels.flatten()
            data_bits = ''.join(str(pixel & 1) for pixel in flat_pixels[self.LENGTH_BITS:self.LENGTH_BITS + data_length])

            # Convert bits to string
            extracted_data = self._bits_to_string(data_bits)

            # Check for magic header
            if not extracted_data.startswith(self.MAGIC_HEADER):
                return False, "No valid SeAl tag found"

            # Remove magic header and return encrypted tag
            encrypted_tag = extracted_data[self.HEADER_LENGTH:]

            return True, encrypted_tag

        except Exception as e:
            print(f"Error extracting tag: {str(e)}")
            return False, f"Error: {str(e)}"

    def calculate_capacity(self, image_path: str) -> int:
        """
        Calculate how many characters can be hidden in an image

        Args:
            image_path: Path to image

        Returns:
            Maximum number of characters that can be hidden
        """
        try:
            img = Image.open(image_path)
            pixels = np.array(img)
            # Each character = 8 bits, subtract length header
            return (pixels.size - self.LENGTH_BITS) // 8
        except:
            return 0
