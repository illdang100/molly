package kr.co.kumoh.illdang100.mollyspring.dto.medication;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class MedicationRespDto {

    @Data
    @AllArgsConstructor
    public static class MedicationSaveResponse {
        private Long medicationId;
    }

    @Data
    @AllArgsConstructor
    public static class MedicationListResponse {
        private List<MedicationResponse> medication;
    }

    @Data
    @AllArgsConstructor
    public static class MedicationResponse {
        private Long medicationId;
        private String medicationName;
        @JsonFormat(pattern="yyyy-MM-dd")
        private LocalDate medicationStartDate;
        @JsonFormat(pattern="yyyy-MM-dd")
        private LocalDate medicationEndDate;
    }
}
