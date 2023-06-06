package kr.co.kumoh.illdang100.mollyspring.domain.image;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Data
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ImageFile  {

    @Column(length = 75)
    private String uploadFileName;

    @Column(length = 75)
    private String storeFileName;

    @Column(length = 200)
    private String storeFileUrl;

    public ImageFile(String uploadFileName, String storeFileName, String storeFileUrl) {
        this.uploadFileName = uploadFileName;
        this.storeFileName = storeFileName;
        this.storeFileUrl = storeFileUrl;
    }
}
