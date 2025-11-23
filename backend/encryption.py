"""
AES-256 Encryption Module for SeAI Tag
Handles encryption and decryption of the SeAl tag
"""

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import PBKDF2
import base64
import hashlib


class SeAlEncryption:
    """Handle AES-256 encryption/decryption for SeAl tags"""

    def __init__(self, master_key: str):
        """
        Initialize encryption handler with master key

        Args:
            master_key: Master password for key derivation
        """
        self.master_key = master_key.encode('utf-8')

    def _derive_key(self, salt: bytes) -> bytes:
        """
        Derive a 256-bit key from master password using PBKDF2

        Args:
            salt: Salt for key derivation

        Returns:
            32-byte encryption key
        """
        return PBKDF2(self.master_key, salt, dkLen=32, count=100000)

    def encrypt(self, data: str) -> str:
        """
        Encrypt data using AES-256-GCM

        Args:
            data: Plain text data to encrypt

        Returns:
            Base64 encoded encrypted data with format: salt:nonce:tag:ciphertext
        """
        # Generate random salt and derive key
        salt = get_random_bytes(16)
        key = self._derive_key(salt)

        # Create cipher in GCM mode for authentication
        cipher = AES.new(key, AES.MODE_GCM)

        # Encrypt the data
        ciphertext, tag = cipher.encrypt_and_digest(data.encode('utf-8'))

        # Combine salt, nonce, tag, and ciphertext
        encrypted_data = salt + cipher.nonce + tag + ciphertext

        # Return base64 encoded result
        return base64.b64encode(encrypted_data).decode('utf-8')

    def decrypt(self, encrypted_data: str) -> str:
        """
        Decrypt data encrypted with AES-256-GCM

        Args:
            encrypted_data: Base64 encoded encrypted data

        Returns:
            Decrypted plain text

        Raises:
            ValueError: If decryption fails or data is tampered with
        """
        try:
            # Decode base64
            encrypted_bytes = base64.b64decode(encrypted_data)

            # Extract components
            salt = encrypted_bytes[:16]
            nonce = encrypted_bytes[16:32]
            tag = encrypted_bytes[32:48]
            ciphertext = encrypted_bytes[48:]

            # Derive key from salt
            key = self._derive_key(salt)

            # Create cipher and decrypt
            cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
            plaintext = cipher.decrypt_and_verify(ciphertext, tag)

            return plaintext.decode('utf-8')
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")

    def generate_seal_tag(self, metadata: dict = None) -> str:
        """
        Generate a SeAl tag with optional metadata

        Args:
            metadata: Optional dictionary with image metadata

        Returns:
            Encrypted SeAl tag
        """
        seal_data = "SeAl:AI-GENERATED"
        if metadata:
            seal_data += f":{metadata}"

        return self.encrypt(seal_data)

    def verify_seal_tag(self, encrypted_tag: str) -> bool:
        """
        Verify if an encrypted tag is a valid SeAl tag

        Args:
            encrypted_tag: Encrypted SeAl tag to verify

        Returns:
            True if valid SeAl tag, False otherwise
        """
        try:
            decrypted = self.decrypt(encrypted_tag)
            return decrypted.startswith("SeAl:AI-GENERATED")
        except:
            return False
