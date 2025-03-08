# Function to print Hello, World!
import os


def say_hello():
    a = input("Enter Your Name ? ")
    print("Files from user " + a + " : " + str(os.listdir()))


# Call the function
say_hello()
