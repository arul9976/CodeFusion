public class JavaSTring {
    // Function to print Hello, World!
    public static void sayHello() {
        System.out.println("Hello, World!");
        String str = "ABC";  
        int n = str.length();  
        JavaSTring permutation =  
        new JavaSTring();  
        permutation.permute(str, 0, n-1);  
    }

    public static void main(String[] args) {
        sayHello();
    }
    private void permute(String str,  
                         int l, int r)  
    {  
        if (l == r)  
            System.out.println(str);  
        else
        {  
            for (int i = l; i <= r; i++)  
            {  
                str = swap(str,l,i);  
                permute(str, l+1, r);  
                str = swap(str,l,i);  
            }  
        }  
    }  
  
    /* Swap Characters at position  
       @param a string value @param  
       i position 1 @param j position 2  
       @return swapped string */
    public String swap(String a,  
                       int i, int j)  
    {  
        char temp;  
        char[] charArray = a.toCharArray();  
        temp = charArray[i] ;  
        charArray[i] = charArray[j];  
        charArray[j] = temp;  
        return String.valueOf(charArray);  
    }  
}