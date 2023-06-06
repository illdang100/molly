package kr.co.kumoh.illdang100.mollyspring.repository.surgery;

import com.querydsl.jpa.impl.JPAQueryFactory;
import kr.co.kumoh.illdang100.mollyspring.domain.surgery.QSurgeryHistory;

import javax.persistence.EntityManager;
import java.time.LocalDate;

import static kr.co.kumoh.illdang100.mollyspring.domain.surgery.QSurgeryHistory.*;

public class SurgeryRepositoryImpl implements SurgeryRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public SurgeryRepositoryImpl(EntityManager em)  {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Boolean existSurgeryByPet(Long petId, String surgeryName, LocalDate surgeryDate) {
        Integer exists = queryFactory
                .selectOne()
                .from(surgeryHistory)
                .where(surgeryHistory.pet.id.eq(petId),
                        surgeryHistory.surgeryName.eq(surgeryName),
                        surgeryHistory.surgeryDate.eq(surgeryDate))
                .fetchFirst();
        return exists != null;
    }
}
