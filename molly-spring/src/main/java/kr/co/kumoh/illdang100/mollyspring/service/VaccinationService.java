package kr.co.kumoh.illdang100.mollyspring.service;

import kr.co.kumoh.illdang100.mollyspring.domain.pet.Pet;
import kr.co.kumoh.illdang100.mollyspring.domain.vaccinations.VaccinationHistory;
import kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationRespDto.VaccinationResponse;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import kr.co.kumoh.illdang100.mollyspring.repository.pet.PetRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.vaccination.VaccinationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationReqDto.*;


@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VaccinationService {

    private final VaccinationRepository vaccinationRepository;
    private final PetRepository petRepository;

    /**
     * 예방접종 이력 추가
     * @param vaccinationSaveRequest
     * @return
     */
    @Transactional
    public Long saveVaccination(VaccinationSaveRequest vaccinationSaveRequest) {
        Long petId = vaccinationSaveRequest.getPetId();
        Pet findPet = findPetOrElseThrow(petId);

        String vaccinationName = vaccinationSaveRequest.getVaccinationName();
        LocalDate vaccinationDate = vaccinationSaveRequest.getVaccinationDate();
        Boolean exists = vaccinationRepository.existsVaccinationByPet(petId, vaccinationName, vaccinationDate);
        if (exists == Boolean.TRUE) throw new CustomApiException("해당 예방접종 이력이 이미 존재합니다.");

        VaccinationHistory vaccination = VaccinationHistory.builder()
                .pet(findPet)
                .vaccinationName(vaccinationName)
                .vaccinationDate(vaccinationDate)
                .build();

         vaccinationRepository.save(vaccination);

         return vaccination.getId();
    }

    /**
     * 예방접종 이력 조회
     * @param petId
     * @return
     */
    public List<VaccinationResponse> viewVaccinationList(Long petId) {

        List<VaccinationHistory> vHistory = vaccinationRepository.findByPet_IdOrderByVaccinationDateAsc(petId);
        if (vHistory == null) throw new CustomApiException("예방접종 이력이 존재하지 않습니다.");
        return vHistory.stream()
                .map(v -> new VaccinationResponse(v.getId(), v.getVaccinationName(), v.getVaccinationDate()))
                .collect(Collectors.toList());
    }

    /**
     * 예방접종 이력 수정
     * @param request
     */
    @Transactional
    public void updateVaccination(VaccinationUpdateRequest request) {
        Long petId = request.getPetId();
        findPetOrElseThrow(petId);

        Long vaccinationId = request.getVaccinationId();
        VaccinationHistory vaccination = findVaccinationOrElseThrow(vaccinationId);

        vaccination.updateVaccination(request);
    }

    /**
     * 예방접종 이력 삭제
     * @param request
     */
    @Transactional
    public void deleteVaccination(VaccinationDeleteRequest request) {
        Long petId = request.getPetId();
        findPetOrElseThrow(petId);

        Long vaccinationId = request.getVaccinationId();
        VaccinationHistory vaccination = findVaccinationOrElseThrow(vaccinationId);

        vaccinationRepository.deleteById(vaccinationId);
    }

    private VaccinationHistory findVaccinationOrElseThrow(Long vaccinationId) {
        return vaccinationRepository.findById(vaccinationId)
                .orElseThrow(() -> new CustomApiException("예방접종 이력이 존재하지 않습니다."));
    }

    public Pet findPetOrElseThrow(Long petId) {

        return petRepository.findById(petId)
                .orElseThrow(() -> new CustomApiException("존재하지 않는 반려동물입니다."));
    }
}
