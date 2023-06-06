package kr.co.kumoh.illdang100.mollyspring.domain.image;

import kr.co.kumoh.illdang100.mollyspring.domain.pet.Pet;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PetImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_image_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @Embedded
    @Column(nullable = false)
    private ImageFile petProfileImage;

    @Builder
    public PetImage(Long id, Pet pet, ImageFile petProfileImage) {
        this.id = id;
        this.pet = pet;
        this.petProfileImage = petProfileImage;
    }

    public void updatePetProfileImage(ImageFile petProfileImage){
        this.petProfileImage = petProfileImage;
    }
}
