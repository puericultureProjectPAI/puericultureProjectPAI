package com.puericulture.troc.controller;

import com.puericulture.common.entity.Person;
import com.puericulture.common.repository.PersonRepository;
import com.puericulture.troc.entity.ProductTroc;
import com.puericulture.troc.repository.ProductTrocRepository;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/troc/dev")
public class DevController { // A supprimer après les tests

    private final ProductTrocRepository productTrocRepository;
    private final PersonRepository personRepository;

    public DevController(
            ProductTrocRepository productTrocRepository, PersonRepository personRepository) {
        this.productTrocRepository = productTrocRepository;
        this.personRepository = personRepository;
    }

    @PostMapping("/seed")
    public void seed() {

        Person toky =
                personRepository
                        .findById(UUID.fromString("10814ed3-a02b-4b69-9d64-aa96ed92bceb"))
                        .orElseThrow();

        Person alice =
                personRepository
                        .findById(UUID.fromString("3ea68001-4154-4417-85ca-03383e0513b2"))
                        .orElseThrow();

        Person mateo =
                personRepository
                        .findById(UUID.fromString("e50f8bb1-d640-44a8-a0f7-9b8e51b4db9d"))
                        .orElseThrow();

        ProductTroc p1 = new ProductTroc();
        p1.setPostTitle("Poussette");
        p1.setCategory("TROC");
        p1.setCity("Paris");
        p1.setDescription("Bonne poussette");
        p1.setAuthor(toky);

        ProductTroc p2 = new ProductTroc();
        p2.setPostTitle("Lit bébé");
        p2.setCategory("TROC");
        p2.setCity("Lille");
        p2.setDescription("Très bon état");
        p2.setAuthor(alice);

        ProductTroc p3 = new ProductTroc();
        p3.setPostTitle("Voiture bébé");
        p3.setCategory("TROC");
        p3.setCity("Marseille");
        p3.setDescription("Très bon état");
        p3.setAuthor(mateo);

        productTrocRepository.save(p1);
        productTrocRepository.save(p2);
        productTrocRepository.save(p3);
    }
}
