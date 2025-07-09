import java.awt.*;
import java.util.Random;

public class TeamsKeepAlive {
    public static void main(String[] args) throws Exception {
        Robot robot = new Robot();
        Random rand = new Random();
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

            // 可选：模拟轻点鼠标（不建议频繁点击，否则会干扰操作）
            // robot.mousePress(InputEvent.BUTTON1_DOWN_MASK);
            // robot.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);

            // 每1分钟动一次
            Thread.sleep(60_000);
        }
    }
}
