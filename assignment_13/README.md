# Assignment 13: Performance Testing & Security Basics

This folder contains the scripts required for Week 13 assignment.

## 1. Performance Testing (`performance_test.py`)

This script tests the performance of a website by sending multiple concurrent requests.

### How to run:
1.  Ensure you have Python installed.
2.  Install the `requests` library if you haven't already:
    ```bash
    pip install requests
    ```
3.  Run the script:
    ```bash
    python performance_test.py
    ```
4.  **Note**: You can change the `target_url` inside the file to test your own deployed website (e.g., `https://your-app.onrender.com`) or localhost.

## 2. Security Examples (`security_examples.py`)

This script demonstrates:
*   **SQL Injection**: Unsafe vs Safe (Parameterized) queries.
*   **XSS (Cross-Site Scripting)**: Unsafe vs Safe (Escaped) HTML generation.
*   **Password Storage**: Plain text vs Hashing vs Salted Hashing vs Bcrypt.

### How to run:
1.  Install the `bcrypt` library:
    ```bash
    pip install bcrypt
    ```
2.  Run the script:
    ```bash
    python security_examples.py
    ```

## Summary of Concepts

### Performance Testing
*   Measures response time, stability, and scalability.
*   The script calculates min/max/avg response times and requests per second.

### Security Flaws
*   **SQL Injection**: Attackers insert malicious SQL code. Prevent it using **Parameterized Queries**.
*   **XSS**: Attackers inject malicious scripts into web pages. Prevent it by **Sanitizing Inputs** (escaping HTML characters).

### Password Storage
*   **Never** store passwords in plain text.
*   **Hashing** (e.g., SHA256) is better but vulnerable to rainbow tables.
*   **Salting** adds random data to the hash to prevent rainbow table attacks.
*   **Bcrypt** is a modern, slow hashing algorithm designed specifically for passwords.
