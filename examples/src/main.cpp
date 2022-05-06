#include <iostream>
#include <stdexcept>

int main() {
  try {
    std::cout << "Hello, world!\n"
              << "sizeof(size_t) == " << sizeof(size_t) << "\n";
  } catch (std::runtime_error &re) {
    std::cout << re.what() << std::endl;
  }
}
