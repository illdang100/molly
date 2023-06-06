package kr.co.kumoh.illdang100.mollyspring.repository.medication;

import java.time.LocalDate;

public interface MedicationRepositoryCustom {
    Boolean existsMedicationByPet(Long petId, String medicationName, LocalDate medicationStartDate);
}
