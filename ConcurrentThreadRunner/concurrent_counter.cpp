#include <iostream>
#include <thread>
#include <mutex>
#include <atomic>

// Shared resources
std::mutex mtx;
std::atomic<bool> finished(false);

// Function to count up
void countUp() {
    for (int i = 0; i <= 20; ++i) {
        std::lock_guard<std::mutex> lock(mtx);
        std::cout << "Counting Up: " << i << std::endl;
    }
    finished = true;
}

// Function to count down
void countDown() {
    while (!finished) {
        std::this_thread::yield(); // Optional: reduce CPU usage
    }
    for (int i = 20; i >= 0; --i) {
        std::lock_guard<std::mutex> lock(mtx);
        std::cout << "Counting Down: " << i << std::endl;
    }
}

int main() {
    std::thread t1(countUp);
    std::thread t2(countDown);

    t1.join();
    t2.join();

    return 0;
}
