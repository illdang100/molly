package kr.co.kumoh.illdang100.mollyspring.domain.medication;

import kr.co.kumoh.illdang100.mollyspring.domain.BaseTimeEntity;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.Pet;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

import static kr.co.kumoh.illdang100.mollyspring.dto.medication.MedicationReqDto.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MedicationHistory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "medication_history_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @Column(nullable = false)
    private LocalDate medicationStartDate;

    @Column(nullable = false)
    private LocalDate medicationEndDate;

    @Column(nullable = false, length = 30)
    private String medicationName;

    @Builder
    public MedicationHistory(Long id, Pet pet, LocalDate medicationStartDate, LocalDate medicationEndDate, String medicationName) {
        this.id = id;
        this.pet = pet;
        this.medicationStartDate = medicationStartDate;
        this.medicationEndDate = medicationEndDate;
        this.medicationName = medicationName;
    }

    public void updateMedication(MedicationUpdateRequest medicationUpdateRequest) {
        this.medicationName = medicationUpdateRequest.getMedicationName();
        this.medicationStartDate = medicationUpdateRequest.getMedicationStartDate();
        this.medicationEndDate = medicationUpdateRequest.getMedicationEndDate();
    }
}
