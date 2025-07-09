import java.awt.*;
import java.util.Random;

public class TeamsKeepAlive {
    public static void main(String[] args) throws Exception {
        // 后台循环自动保持 Teams 在线
        Robot robot = new Robot();
        Random rand = new Random();
        System.out.println("Teams 保持在线程序已启动，按 Ctrl+C 退出。");
        while (true) {
            // 获取当前鼠标位置
            PointerInfo pointerInfo = MouseInfo.getPointerInfo();
            Point point = pointerInfo.getLocation();
            int x = (int) point.getX();
            int y = (int) point.getY();

            // 随机偏移+1/-1像素，防止太规律
            int dx = rand.nextBoolean() ? 1 : -1;
            int dy = rand.nextBoolean() ? 1 : -1;
            robot.mouseMove(x + dx, y + dy);

            // 控制台输出提示
            System.out.printf("鼠标微动到 (%d, %d)%n", x + dx, y + dy);

            // 每1分钟动一次
            Thread.sleep(60_000);
        }
    }
}
