// Java Example
import java.util.Scanner;
public class TempCode {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        Scanner sc = new Scanner(System.in);
        
        System.out.println("Enter Name ?");
        String name = sc.nextLine();
        sc.nextLine();
        System.out.println("Enter age ?");
        int age = sc.nextInt();
        
        System.out.println("Name: "+name+"\nAge: "+age);
        
    }
}