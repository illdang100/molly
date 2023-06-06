package kr.co.kumoh.illdang100.mollyspring.dto.vaccination;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;


public class VaccinationRespDto {

    @Data
    @AllArgsConstructor
    public static class VaccinationSaveResponse {
        private Long vaccinationId;
    }

    @Data
    @AllArgsConstructor
    public static class VaccinationListResponse {
        private List<VaccinationResponse> vaccination;
    }

    @Data
    @AllArgsConstructor
    public static class VaccinationResponse {
        private Long vaccinationId;
        private String vaccinationName;
        @JsonFormat(pattern="yyyy-MM-dd")
        private LocalDate vaccinationDate;
    }
}
