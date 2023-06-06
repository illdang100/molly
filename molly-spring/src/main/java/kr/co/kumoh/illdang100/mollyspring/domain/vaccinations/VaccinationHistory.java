package kr.co.kumoh.illdang100.mollyspring.domain.vaccinations;

import kr.co.kumoh.illdang100.mollyspring.domain.BaseTimeEntity;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.Pet;
import kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationReqDto;
import kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationReqDto.VaccinationUpdateRequest;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VaccinationHistory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccination_history_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @Column(nullable = false)
    private LocalDate vaccinationDate;

    @Column(nullable = false, length = 30)
    private String vaccinationName;

    @Builder
    public VaccinationHistory(Long id, Pet pet, LocalDate vaccinationDate, String vaccinationName) {
        this.id = id;
        this.pet = pet;
        this.vaccinationDate = vaccinationDate;
        this.vaccinationName = vaccinationName;
    }

    public void updateVaccination(VaccinationUpdateRequest vaccinationUpdateRequest) {
        this.vaccinationName = vaccinationUpdateRequest.getVaccinationName();
        this.vaccinationDate = vaccinationUpdateRequest.getVaccinationDate();
    }
}
