## ConcurrentThreadRunner

### 📌 Overview
ConcurrentThreadRunner is a simple C++ concurrency program demonstrating how two threads operate in sequence using `std::thread`, `std::mutex`, and `std::atomic`. One thread counts up from 0 to 20, and once finished, the second thread counts down from 20 to 0.

---

### ✨ Features
- Uses multithreading with `std::thread`
- Demonstrates safe synchronization using `std::mutex`
- Uses `std::atomic<bool>` to coordinate thread completion
- Clean, easy-to-understand example for learning concurrency

---

### 🛠 Technologies Used
- C++
- `<thread>`
- `<mutex>`
- `<atomic>`

---

### 📁 File Structure

