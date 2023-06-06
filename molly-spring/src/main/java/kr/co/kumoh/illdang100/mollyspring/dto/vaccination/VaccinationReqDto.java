package kr.co.kumoh.illdang100.mollyspring.dto.vaccination;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class VaccinationReqDto {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VaccinationSaveRequest {
        @NotNull
        private Long petId;

        @NotBlank(message = "예방접종 이름은 빈 문자열이면 안됩니다.")
        private String vaccinationName;

        @NotNull
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate vaccinationDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VaccinationUpdateRequest {

        @NotNull
        private Long petId;

        @NotNull
        private Long vaccinationId;

        @NotBlank(message = "예방접종 이름은 빈 문자열이면 안됩니다.")
        private String vaccinationName;

        @NotNull
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate vaccinationDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VaccinationDeleteRequest {

        @NotNull
        private Long petId;

        @NotNull
        private Long vaccinationId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VaccinationRequest {
        private String vaccinationName;
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate vaccinationDate;
    }
}