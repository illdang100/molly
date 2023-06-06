package kr.co.kumoh.illdang100.mollyspring.repository.surgery;

import java.time.LocalDate;

public interface SurgeryRepositoryCustom {
    Boolean existSurgeryByPet(Long petId, String surgeryName, LocalDate surgeryDate);
}
