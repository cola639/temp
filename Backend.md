import org.springframework.http.MediaType;

public class MediaTypeUtil {

    /**
     * Get MediaType based on filename extension
     */
    public static MediaType getMediaType(String filename) {
        if (filename == null || !filename.contains(".")) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }

        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        switch (ext) {
            case "pdf":
                return MediaType.APPLICATION_PDF;
            case "png":
                return MediaType.IMAGE_PNG;
            case "jpg":
            case "jpeg":
                return MediaType.IMAGE_JPEG;
            case "gif":
                return MediaType.IMAGE_GIF;
            case "txt":
                return MediaType.TEXT_PLAIN;
            case "json":
                return MediaType.APPLICATION_JSON;
            case "xml":
                return MediaType.APPLICATION_XML;
            case "html":
                return MediaType.TEXT_HTML;
            case "csv":
                return new MediaType("text", "csv");
            case "xls":
                return MediaType.parseMediaType("application/vnd.ms-excel");
            case "xlsx":
                return MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            case "doc":
                return MediaType.parseMediaType("application/msword");
            case "docx":
                return MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            case "ppt":
                return MediaType.parseMediaType("application/vnd.ms-powerpoint");
            case "pptx":
                return MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.presentationml.presentation");
            default:
                return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
