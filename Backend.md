import java.awt.*;
import java.util.Random;

public class TeamsKeepAlive {
    public static void main(String[] args) throws Exception {
        Robot robot = new Robot();
        Random rand = new Random();
        System.out.println("Teams 保持在线程序已启动，按 Ctrl+C 退出。");

        while (true) {
            // 获取当前鼠标位置
            PointerInfo pointerInfo = MouseInfo.getPointerInfo();
            Point point = pointerInfo.getLocation();
            int x = (int) point.getX();
            int y = (int) point.getY();

            // 随机生成偏移量（比如 20~40 像素，防止太小无感）
            int offset = 20 + rand.nextInt(20); // 20~39像素
            int dx = rand.nextBoolean() ? offset : -offset;
            int dy = rand.nextBoolean() ? offset : -offset;

            // 先移动到偏移点
            robot.mouseMove(x + dx, y + dy);
            System.out.printf("鼠标移动到 (%d, %d)%n", x + dx, y + dy);

            // 停顿2秒，再移回原位置
            Thread.sleep(2000);
            robot.mouseMove(x, y);
            System.out.printf("鼠标还原到 (%d, %d)%n", x, y);

            // 每2分钟动一次
            Thread.sleep(118_000); // 剩余时间，约2分钟1次
        }
    }
}
