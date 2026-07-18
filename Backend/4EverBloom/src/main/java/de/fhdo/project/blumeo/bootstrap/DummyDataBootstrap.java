package de.fhdo.project.blumeo.bootstrap;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import de.fhdo.project.blumeo.entity.bouquet.BouquetComponent;
import de.fhdo.project.blumeo.entity.bouquet.CustomBouquet;
import de.fhdo.project.blumeo.entity.bouquet.Occasion;
import de.fhdo.project.blumeo.entity.bouquet.PremadeBouquet;
import de.fhdo.project.blumeo.entity.bouquet.Wrapping;
import de.fhdo.project.blumeo.entity.cart.Cart;
import de.fhdo.project.blumeo.entity.cart.CartItem;
import de.fhdo.project.blumeo.entity.cart.CartStatus;
import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import de.fhdo.project.blumeo.entity.order.Address;
import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.order.OrderLine;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.bouquet.BouquetRepository;
import de.fhdo.project.blumeo.repository.cart.CartRepository;
import de.fhdo.project.blumeo.repository.flower.FlowerRepository;
import de.fhdo.project.blumeo.repository.inventory.ShopStemRepository;
import de.fhdo.project.blumeo.repository.order.OrderLineRepository;
import de.fhdo.project.blumeo.repository.order.OrderRepository;
import de.fhdo.project.blumeo.repository.rating.RatingRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;

//Lab3
@Component
public class DummyDataBootstrap implements ApplicationListener<ContextRefreshedEvent> {

    private final UserRepository userRepository;
    private final FlowerRepository flowerRepository;
    private final ShopStemRepository shopStemRepository;
    private final BouquetRepository bouquetRepository;
    private final CartRepository cartRepository;
    private final RatingRepository ratingRepository;
    private final OrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;

    public DummyDataBootstrap(UserRepository userRepository, FlowerRepository flowerRepository, ShopStemRepository shopStemRepository, BouquetRepository bouquetRepository, CartRepository cartRepository, RatingRepository ratingRepository,  OrderRepository orderRepository,
                          OrderLineRepository orderLineRepository) {
        this.userRepository = userRepository;
        this.flowerRepository = flowerRepository;
        this.shopStemRepository = shopStemRepository;
        this.bouquetRepository = bouquetRepository;
        this.cartRepository = cartRepository;
        this.ratingRepository = ratingRepository;

        
        this.orderRepository = orderRepository;
        this.orderLineRepository = orderLineRepository;

    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        initData();
    }

    private void initData() {
        if (userRepository.count() > 0 || flowerRepository.count() > 0 || bouquetRepository.count() > 0) {
            return;
        }

        //Create test user-owner
        User owner = new User();
        owner.setUsername("blossoms");
        owner.setEmail("blossoms@outlook.com");
        owner.setPassword("blossomsflowers");
        owner.setRole(Role.OWNER);

        owner.setShopName("Blossoms");
        owner.setFlowerShopType("Boutique");
        owner.setLink("https://roseparadise.blumeo.test");
        owner.setLogo("https://i.etsystatic.com/34374772/r/il/c338b0/5033583096/il_fullxfull.5033583096_cwje.jpg");
        owner.setDescription("Exquisite flowers, timeless elegance.");

        owner.setOpeningTime(LocalTime.of(9, 0));
        owner.setClosingTime(LocalTime.of(18, 0));

        Address ownerAddress = new Address();
        ownerAddress.setCity("Dortmund");
        ownerAddress.setStreetAddress("Viktoriastraße 15");
        ownerAddress.setZipCode("44135");
        ownerAddress.setState("North Rhine-Westphalia");
        owner.setAddress(ownerAddress);

        owner.setPhoneNumber("+491234567890");

        owner = userRepository.save(owner);

        //Create test user-customer
        User customer = new User();
        customer.setUsername("alice");
        customer.setEmail("alice@blumeo.test");
        customer.setPassword("customerpassword");
        customer.setRole(Role.CUSTOMER);
        customer.setPhoneNumber("+491112223334");

        Address customerAddress = new Address();
        customerAddress.setCity("Berlin");
        customerAddress.setStreetAddress("Blumenweg 7");
        customerAddress.setZipCode("10115");
        customer.setAddress(customerAddress);

        customer = userRepository.save(customer);

        //Create test user-owner 2.0
        User owner2 = new User();
        owner2.setUsername("petals_paradise");
        owner2.setEmail("petals.paradise@blumeo.test");
        owner2.setPassword("petalsparadise123");
        owner2.setRole(Role.OWNER);

        owner2.setShopName("Franc & Eli");
        owner2.setFlowerShopType("Concept Store");
        owner2.setLink("https://petalsparadise.blumeo.test");
        owner2.setLogo("https://images-platform.99static.com//yrVX8ufudrS38A20MkM0ADXc6eA=/0x0:1904x1904/fit-in/500x500/99designs-contests-attachments/87/87532/attachment_87532959");

        owner2.setOpeningTime(LocalTime.of(10, 0));
        owner2.setClosingTime(LocalTime.of(20, 0));

        Address owner2Address = new Address();
        owner2Address.setCity("Düsseldorf");
        owner2Address.setStreetAddress("Schwanenmarkt 24");
        owner2Address.setZipCode("40213");
        owner2Address.setState("North Rhine-Westphalia");
        owner2.setAddress(owner2Address);

        owner2.setPhoneNumber("+492345678910");

        owner2 = userRepository.save(owner2);

        //Create three test flowers
        Flower redRose = new Flower();
        redRose.setName("Rose");
        redRose.setColor("Red");
        redRose.setSeason("Summer");

        Flower whiteLily = new Flower();
        whiteLily.setName("Lily");
        whiteLily.setColor("White");
        whiteLily.setSeason("Spring");

        Flower yellowTulip = new Flower();
        yellowTulip.setName("Tulip");
        yellowTulip.setColor("Yellow");
        yellowTulip.setSeason("Spring");

        flowerRepository.saveAll(List.of(redRose, whiteLily, yellowTulip));

        //Create test ShopStems (owner's inventory)
        ShopStem stemRose = new ShopStem();
        stemRose.setShopOwner(owner);
        stemRose.setFlower(redRose);
        stemRose.setQuantity(500);
        stemRose.setPrice(new BigDecimal("2.50"));
        stemRose.setImageUrl("https://example.com/images/red-rose.jpg");

        ShopStem stemLily = new ShopStem();
        stemLily.setShopOwner(owner);
        stemLily.setFlower(whiteLily);
        stemLily.setQuantity(300);
        stemLily.setPrice(new BigDecimal("3.20"));
        stemLily.setImageUrl("https://example.com/images/white-lily.jpg");

        ShopStem stemTulip = new ShopStem();
        stemTulip.setShopOwner(owner);
        stemTulip.setFlower(yellowTulip);
        stemTulip.setQuantity(400);
        stemTulip.setPrice(new BigDecimal("1.80"));
        stemTulip.setImageUrl("https://example.com/images/yellow-tulip.jpg");

        shopStemRepository.saveAll(List.of(stemRose, stemLily, stemTulip));

        //Create test PremadeBouquets suggested by shop owner
        PremadeBouquet romanticRoses = new PremadeBouquet();
        romanticRoses.setShopOwner(owner);
        romanticRoses.setName("Romantic Roses");
        romanticRoses.setDescription("A romantic bouquet of red roses.");
        romanticRoses.setPrice(new BigDecimal("129.00"));
        romanticRoses.setImageUrl("https://asset.bloomnation.com/c_fill,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,h_2000,q_auto,w_2000/v1750124712/vendor/3752/catalog/product/2/0/20230211060622_file_63e7d91e91094_63e7d927e784b.jpg");
        romanticRoses.getOccasions().add(Occasion.VALENTINES_DAY);
        romanticRoses.getOccasions().add(Occasion.ANNIVERSARY);

        bouquetRepository.save(romanticRoses);

        PremadeBouquet candyBouquet = new PremadeBouquet();
        candyBouquet.setShopOwner(owner);
        candyBouquet.setName("Cotton Candy");
        candyBouquet.setDescription("A bouquet to fall in love.");
        candyBouquet.setPrice(new BigDecimal("89.00"));
        candyBouquet.setImageUrl("https://bloomandboxflowers.com/cdn/shop/products/image_320d6dde-5104-4824-9975-2fc41e5d5e07.heic?v=1718742546&width=2000");
        candyBouquet.getOccasions().add(Occasion.JUST_BECAUSE);
        candyBouquet.getOccasions().add(Occasion.ANNIVERSARY);
        candyBouquet.getOccasions().add(Occasion.BIRTHDAY);
        candyBouquet.getOccasions().add(Occasion.SYMPATHY);

        bouquetRepository.save(candyBouquet);

        PremadeBouquet lilacBouquet = new PremadeBouquet();
        lilacBouquet.setShopOwner(owner);
        lilacBouquet.setName("Mrs. Lilac");
        lilacBouquet.setPrice(new BigDecimal("169.00"));
        lilacBouquet.setImageUrl("https://bloomandboxflowers.com/cdn/shop/products/mrs-lilac-760754.jpg?v=1747859063&width=2000");
        lilacBouquet.getOccasions().add(Occasion.JUST_BECAUSE);
        lilacBouquet.getOccasions().add(Occasion.ANNIVERSARY);
        lilacBouquet.getOccasions().add(Occasion.BIRTHDAY);
        lilacBouquet.getOccasions().add(Occasion.SYMPATHY);
        lilacBouquet.getOccasions().add(Occasion.GRADUATION);

        bouquetRepository.save(lilacBouquet);

        PremadeBouquet pastelSkyBouquet = new PremadeBouquet();
        pastelSkyBouquet.setShopOwner(owner);
        pastelSkyBouquet.setName("Pastel Sky");
        pastelSkyBouquet.setPrice(new BigDecimal("118.00"));
        pastelSkyBouquet.setImageUrl("https://scissorspaperflower.com/cdn/shop/files/image_a4d9c312-0704-4c4b-8063-bc80f670e24c_740x.jpg?v=1689141975");
        pastelSkyBouquet.getOccasions().add(Occasion.JUST_BECAUSE);
        pastelSkyBouquet.getOccasions().add(Occasion.BIRTHDAY);
        pastelSkyBouquet.getOccasions().add(Occasion.SYMPATHY);
        pastelSkyBouquet.getOccasions().add(Occasion.CONGRATULATIONS);
        pastelSkyBouquet.getOccasions().add(Occasion.MOTHERS_DAY);

        bouquetRepository.save(pastelSkyBouquet);

        PremadeBouquet springGardenBliss = new PremadeBouquet();
        springGardenBliss.setShopOwner(owner2);
        springGardenBliss.setName("Spring Garden Bliss");
        springGardenBliss.setDescription("A refreshing mix of tulips, peonies, and garden greenery - perfect for spring celebrations.");
        springGardenBliss.setPrice(new BigDecimal("89.50"));
        springGardenBliss.setImageUrl("https://cdn.unebonnemaison.com/q:i/r:0/wp:1/w:400/u:https://unebonnemaison.com/wp-content/uploads/2025/04/DIY-tuto-tulip-bouquet-tulipes-33.jpg");
        springGardenBliss.getOccasions().add(Occasion.BIRTHDAY);
        springGardenBliss.getOccasions().add(Occasion.MOTHERS_DAY);

        bouquetRepository.save(springGardenBliss);

        PremadeBouquet sunsetPeonyCharm = new PremadeBouquet();
        sunsetPeonyCharm.setShopOwner(owner2);
        sunsetPeonyCharm.setName("Sunset Peony Charm");
        sunsetPeonyCharm.setDescription("Warm-toned peonies and garden roses arranged with eucalyptus - inspired by golden hour sunsets.");
        sunsetPeonyCharm.setPrice(new BigDecimal("149.90"));
        sunsetPeonyCharm.setImageUrl("https://www.realflowers.co.uk/pub/media/catalog/product/cache/0a16fe6c5a12b077b5913b4872a45d22/t/i/timeless_beauty_bouquet_handheld_.jpg");
        sunsetPeonyCharm.getOccasions().add(Occasion.ANNIVERSARY);
        sunsetPeonyCharm.getOccasions().add(Occasion.BIRTHDAY);
        sunsetPeonyCharm.getOccasions().add(Occasion.CONGRATULATIONS);

        bouquetRepository.save(sunsetPeonyCharm);

        //Create test CustomBouquet designed by customer in a specific flower shop
        CustomBouquet customSpring = new CustomBouquet();
        customSpring.setShopOwner(owner);
        customSpring.setDesignedByCustomer(customer);
        customSpring.setName("Spring Mix");
        customSpring.setDescription("Custom spring bouquet designed for my beautiful wife.");
        customSpring.setPrice(new BigDecimal("29.90"));
        customSpring.setWrapping(Wrapping.PREMIUM);

        BouquetComponent comp2 = new BouquetComponent();
        comp2.setShopStem(stemLily);
        comp2.setRequiredQuantity(5);
        customSpring.addComponent(comp2);

        BouquetComponent comp3 = new BouquetComponent();
        comp3.setShopStem(stemTulip);
        comp3.setRequiredQuantity(7);
        customSpring.addComponent(comp3);

        bouquetRepository.save(customSpring);

        //Create test Cart filled with CartItems
        Cart cart = new Cart();
        cart.setUserId(customer.getId());
        cart.setCartStatus(CartStatus.ACTIVE);
        cart.setShopOwner(owner);

        CartItem item1 = new CartItem();
        item1.setCart(cart);
        item1.setBouquet(romanticRoses);
        item1.setQuantity(2);
        item1.setUnitPrice(romanticRoses.getPrice());
        cart.getItems().add(item1);

        CartItem item2 = new CartItem();
        item2.setCart(cart);
        item2.setBouquet(customSpring);
        item2.setQuantity(1);
        item2.setUnitPrice(customSpring.getPrice());
        cart.getItems().add(item2);

        cartRepository.save(cart);

        // =======================
        // Test Order 1
        // =======================
        Order order1 = new Order();
        order1.setCustomer(customer);
        order1.setShop(owner);
        order1.setDeliveryAddress(customer.getAddress());
        order1.setStatus(OrderStatus.DELIVERED);
        order1.setOrderDate(LocalDate.of(2026, 6, 30).atStartOfDay());

        order1 = orderRepository.save(order1);

        OrderLine line1 = new OrderLine();
        line1.setOrder(order1);
        line1.setBouquet(romanticRoses);
        line1.setQuantity(1);
        line1.setPrice(romanticRoses.getPrice());

        OrderLine line2 = new OrderLine();
        line2.setOrder(order1);
        line2.setBouquet(customSpring);
        line2.setQuantity(2);
        line2.setPrice(customSpring.getPrice());

        orderLineRepository.save(line1);
        orderLineRepository.save(line2);

        BigDecimal total = line1.getLineTotal().add(line2.getLineTotal());

        order1.setTotalAmount(total);
        orderRepository.save(order1);

        // =======================
        // Test Order 2
        // =======================

        Order order2 = new Order();
        order2.setCustomer(customer);
        order2.setShop(owner);
        order2.setDeliveryAddress(customer.getAddress());
        order2.setStatus(OrderStatus.DELIVERED);

        order2 = orderRepository.save(order2);

        OrderLine order2Line1 = new OrderLine();
        order2Line1.setOrder(order2);
        order2Line1.setBouquet(candyBouquet);
        order2Line1.setQuantity(3);
        order2Line1.setPrice(candyBouquet.getPrice());

        order2Line1 = orderLineRepository.save(order2Line1);

        BigDecimal order2Total = order2Line1.getLineTotal();

        order2.setTotalAmount(order2Total);
        orderRepository.save(order2);

        // =======================
        // Test Order 3
        // =======================

        Order order3 = new Order();
        order3.setCustomer(customer);
        order3.setShop(owner);
        order3.setDeliveryAddress(customer.getAddress());
        order3.setOrderDate(LocalDateTime.of(2026, 3, 15, 10, 30));
        order3.setStatus(OrderStatus.DELIVERED);

        order3 = orderRepository.save(order3);

        OrderLine order3Line1 = new OrderLine();
        order3Line1.setOrder(order3);
        order3Line1.setBouquet(lilacBouquet);
        order3Line1.setQuantity(2);
        order3Line1.setPrice(lilacBouquet.getPrice());

        order3Line1 = orderLineRepository.save(order3Line1);

        BigDecimal order3Total = order3Line1.getLineTotal();

        order3.setTotalAmount(order3Total);
        orderRepository.save(order3);

        // =======================
        // Test Order 4
        // =======================

        Order order4 = new Order();
        order4.setCustomer(customer);
        order4.setShop(owner);
        order4.setDeliveryAddress(customer.getAddress());
        order4.setStatus(OrderStatus.PAID);

        order4 = orderRepository.save(order4);

        OrderLine order4Line1 = new OrderLine();
        order4Line1.setOrder(order4);
        order4Line1.setBouquet(lilacBouquet);
        order4Line1.setQuantity(4);
        order4Line1.setPrice(lilacBouquet.getPrice());

        order4Line1 = orderLineRepository.save(order4Line1);

        BigDecimal order4Total = order4Line1.getLineTotal();

        order4.setTotalAmount(order4Total);
        orderRepository.save(order4);

        // =======================
        // Test Order 5
        // =======================

        Order order5 = new Order();
        order5.setCustomer(customer);
        order5.setShop(owner);
        order5.setDeliveryAddress(customer.getAddress());
        order5.setOrderDate(LocalDateTime.of(2026, 5, 10, 10, 30));
        order5.setStatus(OrderStatus.DELIVERED);

        order5 = orderRepository.save(order5);

        OrderLine order5Line1 = new OrderLine();
        order5Line1.setOrder(order5);
        order5Line1.setBouquet(pastelSkyBouquet);
        order5Line1.setQuantity(1);
        order5Line1.setPrice(pastelSkyBouquet.getPrice());

        OrderLine order5Line2 = new OrderLine();
        order5Line2.setOrder(order5);
        order5Line2.setBouquet(romanticRoses);
        order5Line2.setQuantity(3);
        order5Line2.setPrice(romanticRoses.getPrice());

        order5Line1 = orderLineRepository.save(order5Line1);
        order5Line2 = orderLineRepository.save(order5Line2);

        BigDecimal order5Total = order5Line1.getLineTotal().add(order5Line2.getLineTotal());

        order5.setTotalAmount(order5Total);
        orderRepository.save(order5);
    }
}


