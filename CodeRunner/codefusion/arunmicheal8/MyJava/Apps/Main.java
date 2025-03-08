
import java.util.Scanner;

// package codefusion.arunmicheal8.MyJava.Apps;
public class Main {

    // Function to print Hello, World!
    public static void sayHello() {
        Scanner s = new Scanner(System.in);
        System.out.println("Hello, World!");
        System.out.println("Hello, World!");
        System.out.println("Hello, World!");

        System.out.println("Enter Name: ");
        String name = s.next();
        System.out.println("Enter Number: ");
        int n = s.nextInt();

        System.out.println("Name: " + name + " Factorial number: " + Kavi.factorial(n));

    }

    public static void main(String[] args) {
        sayHello();
        // System.out.println(factorial(5));
    }

}
