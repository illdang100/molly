package kr.co.kumoh.illdang100.mollyspring.domain.surgery;

import kr.co.kumoh.illdang100.mollyspring.domain.BaseTimeEntity;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.Pet;
import kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryReqDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

import static kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryReqDto.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SurgeryHistory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "surgery_history_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @Column(nullable = false)
    private LocalDate surgeryDate;

    @Column(nullable = false, length = 30)
    private String surgeryName;

    @Builder
    public SurgeryHistory(Long id, Pet pet, LocalDate surgeryDate, String surgeryName) {
        this.id = id;
        this.pet = pet;
        this.surgeryDate = surgeryDate;
        this.surgeryName = surgeryName;
    }

    public void updateSurgery(SurgeryUpdateRequest surgeryUpdateRequest) {
        this.surgeryName = surgeryUpdateRequest.getSurgeryName();
        this.surgeryDate = surgeryUpdateRequest.getSurgeryDate();
    }
}
