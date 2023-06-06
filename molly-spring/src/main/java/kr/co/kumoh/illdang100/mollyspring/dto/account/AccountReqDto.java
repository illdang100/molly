package kr.co.kumoh.illdang100.mollyspring.dto.account;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

public class AccountReqDto {

    @Getter
    @Setter
    public static class LoginReqDto {

        // LoginReqDto는 컨트롤러가 아닌 필터에서 처리되므로 Validation 체크를 수행하지 못한다.
        private String username;
        private String password;
    }

    @Data
    public static class InputNicknameRequest {

        @NotEmpty
        @Pattern(regexp = "^[ㄱ-ㅎ가-힣a-zA-Z]{1,10}$", message = "한글/영문 1~10자 이내로 작성해주세요")
        private String nickname;
    }

    @Data
    public static class SaveAccountRequest {

        @NotEmpty
        @Pattern(regexp = "^[ㄱ-ㅎ가-힣a-zA-Z]{1,10}$", message = "한글/영문 1~10자 이내로 작성해주세요")
        private String nickname;

        private MultipartFile accountProfileImage;
    }

}
