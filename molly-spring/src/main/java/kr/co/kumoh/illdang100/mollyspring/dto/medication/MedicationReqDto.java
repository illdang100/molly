package kr.co.kumoh.illdang100.mollyspring.dto.medication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class MedicationReqDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicationSaveRequest {

        @NotNull
        private Long petId;

        @NotBlank(message = "복용약 이름은 빈 문자열이면 안됩니다.")
        private String medicationName;

        @NotNull
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate medicationStartDate;

        @NotNull
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate medicationEndDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicationUpdateRequest {
        @NotNull
        private Long petId;

        @NotNull
        private Long medicationId;

        @NotBlank(message = "복용약 이름은 빈 문자열이면 안 됩니다.")
        private String medicationName;

        @NotNull
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate medicationStartDate;

        @NotNull
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate medicationEndDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicationDeleteRequest {
        @NotNull
        private Long petId;

        @NotNull
        private Long medicationId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicationRequest {
        private String medicationName;
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate medicationStartDate;
        @DateTimeFormat(pattern="yyyy-MM-dd")
        private LocalDate medicationEndDate;
    }
}