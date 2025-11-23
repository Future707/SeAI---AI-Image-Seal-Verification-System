"""
Secure Key Management System for SeAI
Handles generation and management of encryption keys
"""

import secrets
import string
import hashlib
import os
from datetime import datetime


class KeyManager:
    """Manage encryption keys securely"""

    @staticmethod
    def generate_master_key(length: int = 64) -> str:
        """
        Generate a cryptographically secure master key

        Args:
            length: Length of the key (default: 64 characters)

        Returns:
            Secure random key string
        """
        alphabet = string.ascii_letters + string.digits + string.punctuation
        key = ''.join(secrets.choice(alphabet) for _ in range(length))
        return key

    @staticmethod
    def generate_key_from_passphrase(passphrase: str, salt: str = None) -> str:
        """
        Generate a deterministic key from a passphrase

        Args:
            passphrase: User-provided passphrase
            salt: Optional salt (generated if not provided)

        Returns:
            Derived key as hex string
        """
        if salt is None:
            salt = secrets.token_hex(16)

        key = hashlib.pbkdf2_hmac(
            'sha256',
            passphrase.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return key.hex()

    @staticmethod
    def save_key_to_file(key: str, filepath: str = '.env') -> bool:
        """
        Save master key to .env file

        Args:
            key: Master key to save
            filepath: Path to .env file

        Returns:
            True if successful
        """
        try:
            # Check if file exists and read existing content
            existing_content = {}
            if os.path.exists(filepath):
                with open(filepath, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key_name, value = line.split('=', 1)
                            existing_content[key_name.strip()] = value.strip()

            # Update the master key
            existing_content['SEAL_MASTER_KEY'] = key

            # Write back to file
            with open(filepath, 'w') as f:
                f.write(f"# SeAI Configuration - Generated on {datetime.now().isoformat()}\n")
                f.write(f"# IMPORTANT: Keep this file secure and never commit to version control\n\n")
                for key_name, value in existing_content.items():
                    f.write(f"{key_name}={value}\n")

            return True
        except Exception as e:
            print(f"Error saving key: {str(e)}")
            return False

    @staticmethod
    def validate_key(key: str) -> bool:
        """
        Validate if a key meets security requirements

        Args:
            key: Key to validate

        Returns:
            True if key is valid
        """
        if len(key) < 32:
            return False

        has_upper = any(c.isupper() for c in key)
        has_lower = any(c.islower() for c in key)
        has_digit = any(c.isdigit() for c in key)

        return has_upper and has_lower and has_digit

    @staticmethod
    def hash_key(key: str) -> str:
        """
        Create a hash of the key for verification purposes

        Args:
            key: Key to hash

        Returns:
            SHA-256 hash of the key
        """
        return hashlib.sha256(key.encode('utf-8')).hexdigest()


def main():
    """CLI tool for key generation"""
    print("=" * 70)
    print("SeAI Secure Key Generator")
    print("=" * 70)
    print()

    print("Choose an option:")
    print("1. Generate a new random master key")
    print("2. Create key from passphrase")
    print("3. Exit")
    print()

    choice = input("Enter your choice (1-3): ").strip()

    if choice == '1':
        print("\nGenerating secure random master key...")
        key = KeyManager.generate_master_key()
        print(f"\nGenerated Master Key:")
        print(f"{key}")
        print(f"\nKey Hash (SHA-256): {KeyManager.hash_key(key)}")

        save = input("\nSave this key to .env file? (y/n): ").strip().lower()
        if save == 'y':
            if KeyManager.save_key_to_file(key):
                print("✓ Key saved successfully to .env file")
                print("⚠ Remember to keep this file secure!")
            else:
                print("✗ Failed to save key to file")

    elif choice == '2':
        passphrase = input("\nEnter your passphrase: ").strip()
        if len(passphrase) < 12:
            print("⚠ Warning: Passphrase should be at least 12 characters long")

        salt = input("Enter salt (leave empty for random): ").strip()
        if not salt:
            salt = secrets.token_hex(16)
            print(f"Generated salt: {salt}")

        key = KeyManager.generate_key_from_passphrase(passphrase, salt)
        print(f"\nGenerated Key: {key}")
        print(f"Key Hash: {KeyManager.hash_key(key)}")
        print("\n⚠ Important: Save both the passphrase and salt to regenerate this key")

    elif choice == '3':
        print("\nExiting...")
        return

    else:
        print("\n✗ Invalid choice")

    print("\n" + "=" * 70)


if __name__ == "__main__":
    main()
