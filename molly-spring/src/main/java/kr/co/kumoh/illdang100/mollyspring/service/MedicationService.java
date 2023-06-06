package kr.co.kumoh.illdang100.mollyspring.service;

import kr.co.kumoh.illdang100.mollyspring.domain.medication.MedicationHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.Pet;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import kr.co.kumoh.illdang100.mollyspring.repository.medication.MedicationRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.pet.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static kr.co.kumoh.illdang100.mollyspring.dto.medication.MedicationReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.medication.MedicationRespDto.*;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final PetRepository petRepository;

    /**
     * 복용약 이력 추가
     * @param medicationSaveRequest
     * @return
     */
    @Transactional
    public Long saveMedication(MedicationSaveRequest medicationSaveRequest) {

        Long petId = medicationSaveRequest.getPetId();
        Pet findPet = findPetOrElseThrow(petId);

        String medicationName = medicationSaveRequest.getMedicationName();
        LocalDate medicationStartDate = medicationSaveRequest.getMedicationStartDate();
        LocalDate medicationEndDate = medicationSaveRequest.getMedicationEndDate();

        Boolean exists = existsMedicationHistory(petId, medicationName, medicationStartDate);
        if (exists == Boolean.TRUE) throw new CustomApiException("해당 복용약 이력 이미 존재합니다.");

        MedicationHistory medication = MedicationHistory.builder()
                .pet(findPet)
                .medicationName(medicationName)
                .medicationStartDate(medicationStartDate)
                .medicationEndDate(medicationEndDate)
                .build();
        medicationRepository.save(medication);

        return medication.getId();
    }

    /**
     * 반려동물 복용약 기록 조회
     * @param petId
     * @return
     */
    public List<MedicationResponse> viewMedicationList(Long petId) {

        findPetOrElseThrow(petId);

        List<MedicationHistory> mHistory = medicationRepository.findByPet_IdOrderByMedicationStartDateAsc(petId);
        if (mHistory.isEmpty()) throw new CustomApiException("복용약 기록이 존재하지 않습니다.");

        return mHistory.stream()
                .map(m -> new MedicationResponse(m.getId(), m.getMedicationName(), m.getMedicationStartDate(), m.getMedicationEndDate()))
                .collect(Collectors.toList());
    }

    /**
     * 복용약 기록 수정
     * @param request
     */
    @Transactional
    public void updateMedication(MedicationUpdateRequest request) {
        Long petId = request.getPetId();
        findPetOrElseThrow(petId);

        Long medicationId = request.getMedicationId();
        MedicationHistory medication = findMedicationOrElseThrow(medicationId);

        medication.updateMedication(request);
    }

    /**
     * 복용약 기록 삭제
     * @param request
     */
    @Transactional
    public void deleteMedication(MedicationDeleteRequest request) {
        Long petId = request.getPetId();
        findPetOrElseThrow(petId);

        Long medicationId = request.getMedicationId();
        findMedicationOrElseThrow(medicationId);

        medicationRepository.deleteById(medicationId);
    }

    private MedicationHistory findMedicationOrElseThrow(Long medicationId) {
        return medicationRepository.findById(medicationId)
                .orElseThrow(() -> new CustomApiException("복용약 이력이 존재하지 않습니다."));
    }

    private Boolean existsMedicationHistory(Long petId, String medicationName, LocalDate medicationStartDate) {
        return medicationRepository.existsMedicationByPet(petId, medicationName, medicationStartDate);
    }

    public Pet findPetOrElseThrow(Long petId) {

        return petRepository.findById(petId)
                .orElseThrow(() -> new CustomApiException("존재하지 않는 반려동물입니다."));
    }
}
