import hashlib
import os
import bcrypt # pip install bcrypt

# --- 1. SQL Injection Examples ---
print("\n=== 1. SQL Injection Examples ===")

def unsafe_sql_example(username, password):
    # Муу жишээ - SQL injection эрсдэлтэй
    query = f"SELECT * FROM users WHERE username = {username} AND password = {password}"
    print(f"Unsafe Query: {query}")

def safe_sql_example(cursor, username, password):
    # Сайн жишээ - parameterized query
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    # cursor.execute(query, (username, password)) # Энэ мөр нь бодит DB холболт шаардана
    print(f"Safe Query Structure: {query} with params ({username}, {password})")

unsafe_sql_example("'admin' OR '1'='1'", "'password'")
safe_sql_example(None, "admin", "password123")


# --- 2. XSS Examples ---
print("\n=== 2. Cross-Site Scripting (XSS) Examples ===")
import html

def unsafe_xss_example(user_input):
    # Муу жишээ - XSS эрсдэлтэй
    return f"<div>{user_input}</div>"

def safe_xss_example(user_input):
    # Сайн жишээ - input цэвэрлэх
    safe_input = html.escape(user_input)
    return f"<div>{safe_input}</div>"

malicious_input = "<script>alert('Hacked!');</script>"
print(f"Unsafe HTML: {unsafe_xss_example(malicious_input)}")
print(f"Safe HTML:   {safe_xss_example(malicious_input)}")


# --- 3. Password Storage Examples ---
print("\n=== 3. Password Storage Examples ===")

# 1. Plain text (Ямар ч тохиолдолд бүү хэрэглэ)
users_plain = {
    "admin": "password123",
    "user1": "123456"
}
print("Plain text storage (BAD):", users_plain)

# 2. Hash хэрэглэх (Анхан шатны шийдэл)
def hash_password_simple(password):
    return hashlib.sha256(password.encode()).hexdigest()

hashed_simple = hash_password_simple("password123")
print(f"Simple SHA256: {hashed_simple}")

# 3. Salt бүхий hash (Илүү аюулгүй)
def generate_salt():
    return os.urandom(32)

def hash_password_salt(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)

salt = generate_salt()
hashed_salt = hash_password_salt("password123", salt)
print(f"Salted Hash (hex): {hashed_salt.hex()}")

# 4. Орчин үеийн арга (bcrypt)
print("\n--- Bcrypt Example ---")
try:
    # Нууц үг хэшлэх
    password = b"password123"
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    print(f"Bcrypt Hash: {hashed}")

    # Нууц үг баталгаажуулах
    input_password = b"password123"
    if bcrypt.checkpw(input_password, hashed):
        print("Password matches!")
    else:
        print("Invalid password!")
except ImportError:
    print("bcrypt module not installed. Run 'pip install bcrypt' to see this example.")
