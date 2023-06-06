package kr.co.kumoh.illdang100.mollyspring.dto.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

public class AccountRespDto {

    @Data
    @AllArgsConstructor
    @Builder
    public static class AccountProfileResponse {

        private String profileImage;
        private String nickname;
        private String provider;
        private String email;
    }
}
