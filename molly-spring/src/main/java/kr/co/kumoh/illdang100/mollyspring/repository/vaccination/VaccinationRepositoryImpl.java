package kr.co.kumoh.illdang100.mollyspring.repository.vaccination;

import com.querydsl.jpa.impl.JPAQueryFactory;
import kr.co.kumoh.illdang100.mollyspring.domain.vaccinations.QVaccinationHistory;

import javax.persistence.EntityManager;
import java.time.LocalDate;

import static kr.co.kumoh.illdang100.mollyspring.domain.medication.QMedicationHistory.medicationHistory;
import static kr.co.kumoh.illdang100.mollyspring.domain.vaccinations.QVaccinationHistory.*;

public class VaccinationRepositoryImpl implements VaccinationRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    public VaccinationRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Boolean existsVaccinationByPet(Long petId, String vaccinationName, LocalDate vaccinationDate) {
        Integer exists = queryFactory
                .selectOne()
                .from(vaccinationHistory)
                .where(vaccinationHistory.pet.id.eq(petId),
                        vaccinationHistory.vaccinationName.eq(vaccinationName),
                        vaccinationHistory.vaccinationDate.eq(vaccinationDate))
                .fetchFirst();
        return exists != null;
    }
}
