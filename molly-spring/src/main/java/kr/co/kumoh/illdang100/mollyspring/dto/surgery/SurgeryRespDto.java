package kr.co.kumoh.illdang100.mollyspring.dto.surgery;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

public class SurgeryRespDto {
    @Data
    @AllArgsConstructor
    public static class SurgerySaveResponse {
        private Long surgeryId;
    }

    @Data
    @AllArgsConstructor
    public static class SurgeryListResponse {
        private List<SurgeryResponse> surgery;
    }

    @Data
    @AllArgsConstructor
    public static class SurgeryResponse {
        private Long surgeryId;
        private String surgeryName;
        @JsonFormat(pattern="yyyy-MM-dd")
        private LocalDate surgeryDate;
    }
}