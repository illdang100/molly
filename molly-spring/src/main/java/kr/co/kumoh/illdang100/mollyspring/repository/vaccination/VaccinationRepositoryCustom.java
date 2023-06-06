package kr.co.kumoh.illdang100.mollyspring.repository.vaccination;

import java.time.LocalDate;

public interface VaccinationRepositoryCustom {
    Boolean existsVaccinationByPet(Long petId, String vaccinationName, LocalDate vaccinationDate);
}
