package kr.co.kumoh.illdang100.mollyspring.service;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import kr.co.kumoh.illdang100.mollyspring.domain.image.ImageFile;
import kr.co.kumoh.illdang100.mollyspring.domain.image.PetImage;
import kr.co.kumoh.illdang100.mollyspring.domain.medication.MedicationHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.pet.*;
import kr.co.kumoh.illdang100.mollyspring.domain.surgery.SurgeryHistory;
import kr.co.kumoh.illdang100.mollyspring.domain.vaccinations.VaccinationHistory;
import kr.co.kumoh.illdang100.mollyspring.dto.pet.PetRespDto.PetCalendarResponse;
import kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryRespDto.SurgeryResponse;
import kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationRespDto.VaccinationResponse;
import kr.co.kumoh.illdang100.mollyspring.handler.ex.CustomApiException;
import kr.co.kumoh.illdang100.mollyspring.repository.account.AccountRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.cat.CatRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.dog.DogRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.image.PetImageRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.medication.MedicationRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.pet.PetRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.rabbit.RabbitRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.surgery.SurgeryRepository;
import kr.co.kumoh.illdang100.mollyspring.repository.vaccination.VaccinationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static kr.co.kumoh.illdang100.mollyspring.domain.pet.PetTypeEnum.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.medication.MedicationReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.medication.MedicationRespDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.pet.PetReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.pet.PetRespDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.surgery.SurgeryReqDto.*;
import static kr.co.kumoh.illdang100.mollyspring.dto.vaccination.VaccinationReqDto.*;


@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PetService {
    private final CatRepository catRepository;
    private final DogRepository dogRepository;
    private final RabbitRepository rabbitRepository;
    private final AccountRepository accountRepository;
    private final PetRepository petRepository;
    private final S3Service s3Service;
    private final SurgeryRepository surgeryRepository;
    private final VaccinationRepository vaccinationRepository;
    private final MedicationRepository medicationRepository;
    private final PetImageRepository petImageRepository;
    private final MedicationService medicationService;
    private final SurgeryService surgeryService;
    private final VaccinationService vaccinationService;

    /**
     * 반려동물 등록
     * @param petSaveRequest
     */
    @Transactional
    public Long registerPet(PetSaveRequest petSaveRequest, Account account) {
        Account findUser = findAccountOrElseThrow(account.getId());

        PetTypeEnum petType = petSaveRequest.getPetType();

        Optional<Pet> findPetOpt = petRepository.findByAccount_IdAndPetName(findUser.getId(), petSaveRequest.getPetName());
        if (findPetOpt.isPresent()) throw new CustomApiException("이미 등록된 반려동물입니다.");

        if (petType.equals(CAT)) {
            Pet savedCat = saveCat(petSaveRequest, findUser);
            recordMedicalHistory(petSaveRequest, savedCat);
           return savedCat.getId();
        }
        else if (petType.equals(DOG)) {
            Pet savedDog = saveDog(petSaveRequest, findUser);
            recordMedicalHistory(petSaveRequest, savedDog);
            return savedDog.getId();
        }
        else if (petType.equals(RABBIT)) {
            Pet savedRabbit = saveRabbit(petSaveRequest, findUser);
            recordMedicalHistory(petSaveRequest, savedRabbit);
            return savedRabbit.getId();
        }

        throw new CustomApiException("반려동물 등록 실패");
    }

    private void recordMedicalHistory(PetSaveRequest petSaveRequest, Pet pet) {
        List<MedicationRequest> medicationList = petSaveRequest.getMedication();
        if (!medicationList.isEmpty()) {
            for (MedicationRequest medication : medicationList) {
                MedicationHistory medicationHistory = MedicationHistory.builder()
                        .pet(pet)
                        .medicationName(medication.getMedicationName())
                        .medicationStartDate(medication.getMedicationStartDate())
                        .medicationEndDate(medication.getMedicationEndDate())
                        .build();
                medicationRepository.save(medicationHistory);
            }
        }

        List<SurgeryRequest> surgeryList = petSaveRequest.getSurgery();
        if (!surgeryList.isEmpty()) {
            for (SurgeryRequest surgery : surgeryList) {
                SurgeryHistory surgeryHistory = SurgeryHistory.builder()
                        .pet(pet)
                        .surgeryName(surgery.getSurgeryName())
                        .surgeryDate(surgery.getSurgeryDate())
                        .build();
                surgeryRepository.save(surgeryHistory);
            }
        }

        List<VaccinationRequest> vaccinationList = petSaveRequest.getVaccination();
        if (!vaccinationList.isEmpty()) {
            for (VaccinationRequest vaccination : vaccinationList) {
                VaccinationHistory vaccinationHistory = VaccinationHistory.builder()
                        .pet(pet)
                        .vaccinationName(vaccination.getVaccinationName())
                        .vaccinationDate(vaccination.getVaccinationDate())
                        .build();
                vaccinationRepository.save(vaccinationHistory);
            }
        }
    }

    /**
     * 반려동물 정보 상세보기
     * @param petId
     */
    public PetDetailResponse viewDetails(Long petId) {

        Pet findPet = findPetOrElseThrow(petId);
        PetTypeEnum petType = findPet.getPetType();

        String petSpecies = getPetSpecies(findPet);

        PetDetailResponse petDetailResponse = PetDetailResponse.builder()
                .userId(findPet.getAccount().getId())
                .petId(petId)
                .petType(petType)
                .petName(findPet.getPetName())
                .birthdate(findPet.getBirthdate())
                .gender(findPet.getGender())
                .neuteredStatus(findPet.isNeuteredStatus())
                .weight(findPet.getWeight())
                .species(petSpecies)
                .build();

        if (findPet.getCaution() != null)
            petDetailResponse.setCaution(findPet.getCaution());

        Optional<PetImage> findPetImageOpt = petImageRepository.findByPet_Id(petId);
        if (findPetImageOpt.isPresent()) {
            PetImage findPetImage = findPetImageOpt.get();
            if (findPetImage.getPetProfileImage() != null) {
                petDetailResponse.setProfileImage(findPetImage.getPetProfileImage().getStoreFileName());
            }
        }

        List<SurgeryResponse> surgery = surgeryService.viewSurgeryList(petId);
        List<MedicationResponse> medication = medicationService.viewMedicationList(petId);
        List<VaccinationResponse> vaccination = vaccinationService.viewVaccinationList(petId);

        petDetailResponse.setSurgery(surgery);
        petDetailResponse.setMedication(medication);
        petDetailResponse.setVaccination(vaccination);

        return petDetailResponse;
    }

    /**
     * 반려동물 기본 정보 수정
     * @param petUpdateRequest
     */
    @Transactional
    public Long updatePet(PetUpdateRequest petUpdateRequest, Account account) {

        findAccountOrElseThrow(account.getId());

        Long petId = petUpdateRequest.getPetId();
        Pet findPet = findPetOrElseThrow(petId);

        findPet.updatePet(petUpdateRequest);
        updatePetSpecies(petUpdateRequest.getSpecies(), findPet);

        return findPet.getId();
    }

    private Account findAccountOrElseThrow(Long userId) {

        return accountRepository.findById(userId)
                .orElseThrow(() -> new CustomApiException("존재하지 않는 사용자입니다."));
    }

    /**
     * 반려동물 정보 삭제
     * @param petId
     */
    @Transactional
    public void deletePet(Long petId) {

        Pet findPet = findPetOrElseThrow(petId);

        deleteSurgeryHistory(petId);
        deleteMedicationHistory(petId);
        deleteVaccinationHistory(petId);
        deletePetProfileImage(petId);

        petRepository.delete(findPet);
    }

    private void deleteSurgeryHistory(Long petId) {

        List<SurgeryHistory> sHistory = surgeryRepository.findByPet_Id(petId);
        if (!sHistory.isEmpty()) {
            for (SurgeryHistory s : sHistory)
                surgeryRepository.delete(s);
        }
    }

    private void deleteMedicationHistory(Long petId) {

        List<MedicationHistory> mHistory = medicationRepository.findByPet_Id(petId);
        if (!mHistory.isEmpty()) {
            for (MedicationHistory m : mHistory)
                medicationRepository.delete(m);
        }
    }

    private void deleteVaccinationHistory(Long petId) {

        List<VaccinationHistory> vHistory = vaccinationRepository.findByPet_Id(petId);
        if (!vHistory.isEmpty()) {
            for (VaccinationHistory v : vHistory)
                vaccinationRepository.delete(v);
        }
    }

    /**
     * 연간 달력 정보
     * @param petId
     */
    public PetCalendarResponse viewAnnualCalendarSchedule(Long petId) {

        PetDetailResponse petDetailResponse = viewDetails(petId);
        return PetCalendarResponse.builder()
                .petType(petDetailResponse.getPetType())
                .petName(petDetailResponse.getPetName())
                .birthdate(petDetailResponse.getBirthdate())
                .medication(petDetailResponse.getMedication())
                .surgery(petDetailResponse.getSurgery())
                .vaccination(petDetailResponse.getVaccination())
                .build();
    }

    /**
     * 반려동물 프로필  다른 이미지 변경
     * @param petProfileImageUpdateRequest
     */
    @Transactional
    public void updatePetProfileImage(PetProfileImageUpdateRequest petProfileImageUpdateRequest) {

        Long petId = petProfileImageUpdateRequest.getPetId();
        Pet findPet = findPetOrElseThrow(petId);
        MultipartFile petProfileImage = petProfileImageUpdateRequest.getPetProfileImage();

        Optional<PetImage> findPetImageOpt = petImageRepository.findByPet_Id(petId);

        try {
            ImageFile updatedImageFile = s3Service.upload(petProfileImage, FileRootPathVO.PET_PATH);

            if (findPetImageOpt.isPresent()) {
                PetImage findPetImage = findPetImageOpt.get();
                s3Service.delete(findPetImage.getPetProfileImage().getStoreFileName());
                findPetImage.updatePetProfileImage(updatedImageFile);
            } else {
                petImageRepository.save(PetImage.builder()
                        .pet(findPet)
                        .petProfileImage(updatedImageFile)
                        .build());
            }
        } catch (IOException e) {
            throw new CustomApiException(e.getMessage());
        }
    }

    /**
     * 반려동물 프로필 이미지 삭제 (기본 이미지 변경)
     * @param petId
     */
    @Transactional
    public Pet deletePetProfileImage(Long petId) {

        Pet findPet = findPetOrElseThrow(petId);
        Optional<PetImage> findPetImageOpt = petImageRepository.findByPet_Id(petId);
        if (findPetImageOpt.isPresent()) {
            PetImage findPetImage = findPetImageOpt.get();
            petImageRepository.delete(findPetImage);
            s3Service.delete(findPetImage.getPetProfileImage().getStoreFileName());
        }

        return findPet;
    }

    public List<PetSpeciesResponse> getDogSpecies() {
        List<DogEnum> dogSpecies = Arrays.asList(DogEnum.values());
        return dogSpecies.stream()
                .map(d -> new PetSpeciesResponse(d.getValue(), d.toString()))
                .collect(Collectors.toList());
    }

    public List<PetSpeciesResponse> getCatSpecies() {
        List<CatEnum> catSpecies = Arrays.asList(CatEnum.values());
        return catSpecies.stream()
                .map(c -> new PetSpeciesResponse(c.getValue(), c.toString()))
                .collect(Collectors.toList());
    }

    public List<PetSpeciesResponse> getRabbitSpecies() {
        List<RabbitEnum> rabbitSpecies = Arrays.asList(RabbitEnum.values());
        return rabbitSpecies.stream()
                .map(r -> new PetSpeciesResponse(r.getValue(), r.toString()))
                .collect(Collectors.toList());
    }

    public Pet findPetOrElseThrow(Long petId) {

        return petRepository.findById(petId)
                .orElseThrow(() -> new CustomApiException("존재하지 않는 반려동물입니다."));
    }

    private static String getPetSpecies(Pet findPet) {

        String petSpecies = new String();
        if (isDog(findPet)) {
            Dog dog = (Dog) findPet;
            petSpecies = dog.getDogSpecies().toString();
        }
        else if (isCat(findPet)) {
            Cat cat = (Cat) findPet;
            petSpecies = cat.getCatSpecies().toString();
        }
        else if (isRabbit(findPet)) {
            Rabbit rabbit = (Rabbit) findPet;
            petSpecies = rabbit.getRabbitSpecies().toString();
        }
        return petSpecies;
    }

    private static void updatePetSpecies(String petSpecies, Pet pet) {

        if (isDog(pet)) {
            Dog dog = (Dog) pet;
            DogEnum dogSpecies = DogEnum.valueOf(petSpecies);
            if (!dog.compareDogSpecies(dogSpecies)) dog.updateDogSpecies(dogSpecies);
        }
        else if (isCat(pet)) {
            Cat cat = (Cat) pet;
            CatEnum catSpecies = CatEnum.valueOf(petSpecies);
            if (!cat.compareCatSpecies(catSpecies)) cat.updateCatSpecies(catSpecies);
        }
        else if (isRabbit(pet)) {
            Rabbit rabbit = (Rabbit) pet;
            RabbitEnum rabbitSpecies = RabbitEnum.valueOf(petSpecies);
            if (!rabbit.compareRabbitSpecies(rabbitSpecies)) rabbit.updateRabbitSpecies(rabbitSpecies);
        }
    }

    private static boolean isCat(Pet findPet) {
        return findPet instanceof Cat;
    }

    private static boolean isDog(Pet findPet) {
        return findPet instanceof Dog;
    }

    private static boolean isRabbit(Pet findPet) {
        return findPet instanceof Rabbit;
    }

    @Transactional
    private Pet saveCat(PetSaveRequest petSaveRequest, Account findUser) {

        ImageFile petProfileImage = null;

        MultipartFile multipartFile = petSaveRequest.getPetProfileImage();
        if (multipartFile != null) {
            try{
                petProfileImage = s3Service.upload(petSaveRequest.getPetProfileImage(), FileRootPathVO.PET_PATH);
            } catch (IOException e) {
                throw new CustomApiException(e.getMessage());
            }
        }

        Cat createdCat = createCat(petSaveRequest, findUser);
        Cat savedCat = catRepository.save(createdCat);
        savePetProfileImage(savedCat, petProfileImage);

        return savedCat;
    }

    @Transactional
    private Pet saveDog(PetSaveRequest petSaveRequest,  Account findUser) {

        ImageFile petProfileImage = null;
        MultipartFile multipartFile = petSaveRequest.getPetProfileImage();
        if (multipartFile != null) {
            try {
                petProfileImage = s3Service.upload(petSaveRequest.getPetProfileImage(), FileRootPathVO.PET_PATH);
            } catch (IOException e) {
                throw new CustomApiException(e.getMessage());
            }
        }

        Dog createdDog = createDog(petSaveRequest, findUser);
        Dog savedDog = dogRepository.save(createdDog);
        savePetProfileImage(savedDog, petProfileImage);

        return createdDog;
    }

    @Transactional
    private Pet saveRabbit(PetSaveRequest petSaveRequest, Account findUser) {

        ImageFile petProfileImage = null;
        MultipartFile multipartFile = petSaveRequest.getPetProfileImage();
        if (multipartFile != null) {
            try {
                petProfileImage = s3Service.upload(petSaveRequest.getPetProfileImage(), FileRootPathVO.PET_PATH);
            } catch (IOException e) {
                throw new CustomApiException(e.getMessage());
            }
        }

        Rabbit createdRabbit = createRabbit(petSaveRequest, findUser);
        Rabbit savedRabbit = rabbitRepository.save(createdRabbit);
        savePetProfileImage(savedRabbit, petProfileImage);

        return savedRabbit;
    }


    private Cat createCat(PetSaveRequest petSaveRequest, Account findUser) {

        return Cat.builder()
                .account(findUser)
                .petName(petSaveRequest.getPetName())
                .gender(petSaveRequest.getGender())
                .birthdate(petSaveRequest.getBirthdate())
                .weight(petSaveRequest.getWeight())
                .neuteredStatus(petSaveRequest.isNeuteredStatus())
                .petType(petSaveRequest.getPetType())
                .catSpecies(CatEnum.valueOf(petSaveRequest.getSpecies()))
                .caution(petSaveRequest.getCaution())
                .catSpecies(CatEnum.valueOf(petSaveRequest.getSpecies()))
                .build();
    }

    private Dog createDog(PetSaveRequest petSaveRequest, Account findUser) {

        return Dog.builder()
                .account(findUser)
                .petName(petSaveRequest.getPetName())
                .gender(petSaveRequest.getGender())
                .birthdate(petSaveRequest.getBirthdate())
                .weight(petSaveRequest.getWeight())
                .neuteredStatus(petSaveRequest.isNeuteredStatus())
                .petType(petSaveRequest.getPetType())
                .dogSpecies(DogEnum.valueOf(petSaveRequest.getSpecies()))
                .caution(petSaveRequest.getCaution())
                .dogSpecies(DogEnum.valueOf(petSaveRequest.getSpecies()))
                .build();
    }

    private Rabbit createRabbit(PetSaveRequest petSaveRequest, Account findUser) {

        return Rabbit.builder()
                .account(findUser)
                .petName(petSaveRequest.getPetName())
                .gender(petSaveRequest.getGender())
                .birthdate(petSaveRequest.getBirthdate())
                .weight(petSaveRequest.getWeight())
                .neuteredStatus(petSaveRequest.isNeuteredStatus())
                .petType(petSaveRequest.getPetType())
                .rabbitSpecies(RabbitEnum.valueOf(petSaveRequest.getSpecies()))
                .caution(petSaveRequest.getCaution())
                .rabbitSpecies(RabbitEnum.valueOf(petSaveRequest.getSpecies()))
                .build();
    }


    private void savePetProfileImage (Pet pet, ImageFile petProfileImage) {

        if (petProfileImage != null) {
            PetImage petImage = PetImage.builder()
                    .pet(pet)
                    .petProfileImage(petProfileImage)
                    .build();

            petImageRepository.save(petImage);
        }
    }
}
