/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package es.cediant.abacus;

import java.io.Serializable;

/**
 *
 * @author miguel
 */
public class UploadedImage implements Serializable {
    private static final long serialVersionUID = 9084871829410225479L;
    
    private String name;
    private String mime;
    private long length;
    private byte[] data;
    
    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        int extDot = name.lastIndexOf('.');
        if (extDot > 0) {
            String extension = name.substring(extDot + 1);
            if ("bmp".equals(extension)) {
                mime = "image/bmp";
            } else if ("jpg".equals(extension)) {
                mime = "image/jpeg";
            } else if ("gif".equals(extension)) {
                mime = "image/gif";
            } else if ("png".equals(extension)) {
                mime = "image/png";
            } else {
                mime = "image/unknown";
            }
        }
        this.name = name;
    }

    public long getLength() {
        return length;
    }

    public void setLength(long length) {
        this.length = length;
    }

    public String getMime() {
        return mime;
    }
    
}
