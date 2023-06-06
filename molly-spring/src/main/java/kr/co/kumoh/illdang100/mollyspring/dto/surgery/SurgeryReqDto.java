package kr.co.kumoh.illdang100.mollyspring.dto.surgery;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class SurgeryReqDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SurgerySaveRequest {

        @NotNull
        private Long petId;

        @NotBlank(message = "수술명은 빈 문자열이면 안됩니다.")
        private String surgeryName;

        @NotNull
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate surgeryDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SurgeryUpdateRequest {

        @NotNull
        private Long petId;

        @NotNull
        private Long surgeryId;

        @NotBlank(message = "수술명은 빈 문자열이면 안됩니다.")
        private String surgeryName;

        @NotNull
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate surgeryDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SurgeryDeleteRequest {

        @NotNull
        private Long petId;

        @NotNull
        private Long surgeryId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SurgeryRequest {
        private String surgeryName;
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate surgeryDate;
    }
}