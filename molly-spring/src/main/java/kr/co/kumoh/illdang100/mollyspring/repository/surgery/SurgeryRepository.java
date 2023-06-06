package kr.co.kumoh.illdang100.mollyspring.repository.surgery;

import kr.co.kumoh.illdang100.mollyspring.domain.surgery.SurgeryHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurgeryRepository extends JpaRepository<SurgeryHistory, Long>, SurgeryRepositoryCustom {

    List<SurgeryHistory> findByPet_Id(Long petId);

    List<SurgeryHistory> findByPet_IdOrderBySurgeryDateAsc(Long petId);
}
