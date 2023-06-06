package kr.co.kumoh.illdang100.mollyspring.dto.pet;

import com.fasterxml.jackson.annotation.JsonFormat;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.PetGenderEnum;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.PetTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import static kr.co.kumoh.illdang100.mollyspring.dto.medication.MedicationRespDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryRespDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationRespDto.*;

public class PetRespDto {
    @Data
    @AllArgsConstructor
    public static class PetSaveResponse {
        private Long petId;
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class PetCalendarResponse {
        private PetTypeEnum petType;
        private String petName;
        @JsonFormat(pattern="yyyy-MM-dd")
        private LocalDate birthdate;
        private List<SurgeryResponse> surgery;
        private List<MedicationResponse> medication;
        private List<VaccinationResponse> vaccination;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PetDetailResponse {
        private Long userId;
        private Long petId;
        private PetTypeEnum petType;
        private String petName;
        private String species;
        @JsonFormat(pattern="yyyy-MM-dd")
        private LocalDate birthdate;
        private PetGenderEnum gender;
        private boolean neuteredStatus;
        private double weight;
        private String profileImage;
        private String caution;
        private List<SurgeryResponse> surgery;
        private List<MedicationResponse> medication;
        private List<VaccinationResponse> vaccination;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PetSpeciesResponse {
        private String speciesKo;
        private String speciesEn;
    }
}
