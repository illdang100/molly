package kr.co.kumoh.illdang100.mollyspring.dto.board;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.List;
public class BoardReqDto {

    @Getter
    @Setter
    public static class CreatePostRequest {

        @NotBlank
        @Size(max = 60, message = "제목은 60자 이하로 작성해주세요")
        private String title;
        @NotBlank
        @Size(max = 1000, message = "내용은 1,000자 이하로 작성해주세요")
        private String content;
        @Size(max = 5, message = "이미지는 최대 5장까지 업로드 가능합니다")
        private List<MultipartFile> boardImages;
        @NotBlank
        @Pattern(regexp = "(MEDICAL|FREE)$")
        private String category;
        @NotBlank
        @Pattern(regexp = "(CAT|DOG|RABBIT|NOT_SELECTED)$")
        private String petType;
    }
}
