import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestChildren {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/postgres", "postgres", "postgres");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM children");
            while (rs.next()) {
                System.out.println("Child: " + rs.getString("name") + ", birthdate: " + rs.getDate("birthdate") + ", person_id: " + rs.getString("person_id"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
