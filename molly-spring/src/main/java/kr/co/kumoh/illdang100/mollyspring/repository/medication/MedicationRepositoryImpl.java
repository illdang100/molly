package kr.co.kumoh.illdang100.mollyspring.repository.medication;

import com.querydsl.jpa.impl.JPAQueryFactory;
import kr.co.kumoh.illdang100.mollyspring.domain.medication.QMedicationHistory;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import static kr.co.kumoh.illdang100.mollyspring.domain.medication.QMedicationHistory.medicationHistory;

public class MedicationRepositoryImpl implements MedicationRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    public MedicationRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Boolean existsMedicationByPet(Long petId, String medicationName, LocalDate medicationStartDate) {
        Integer exists = queryFactory
                .selectOne()
                .from(medicationHistory)
                .where(medicationHistory.pet.id.eq(petId),
                        medicationHistory.medicationName.eq(medicationName),
                        medicationHistory.medicationStartDate.eq(medicationStartDate))
                .fetchFirst();
        return exists != null;
    }
}
