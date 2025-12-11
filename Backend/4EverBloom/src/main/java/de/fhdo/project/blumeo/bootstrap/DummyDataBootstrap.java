package de.fhdo.project.blumeo.bootstrap;

import de.fhdo.project.blumeo.entity.bouquet.*;
import de.fhdo.project.blumeo.entity.cart.Cart;
import de.fhdo.project.blumeo.entity.cart.CartItem;
import de.fhdo.project.blumeo.entity.cart.CartStatus;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import de.fhdo.project.blumeo.entity.rating.Rating;
import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.entity.user.User;


import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.order.OrderLine;
import de.fhdo.project.blumeo.entity.order.OrderStatus;

import de.fhdo.project.blumeo.repository.bouquet.BouquetRepository;
import de.fhdo.project.blumeo.repository.cart.CartRepository;
import de.fhdo.project.blumeo.repository.flower.FlowerRepository;
import de.fhdo.project.blumeo.repository.inventory.ShopStemRepository;
import de.fhdo.project.blumeo.repository.rating.RatingRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;

import de.fhdo.project.blumeo.repository.order.OrderRepository;
import de.fhdo.project.blumeo.repository.order.OrderLineRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import de.fhdo.project.blumeo.entity.flower.Flower;


import java.math.BigDecimal;
import java.util.List;

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

    @Autowired
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

        //Create test user-customer and user-owner
        User owner = new User();
        owner.setUsername("rose_shop");
        owner.setEmail("owner@blumeo.test");
        owner.setPassword("ownerpassword");
        owner.setRole(Role.OWNER);
        owner = userRepository.save(owner);

        User customer = new User();
        customer.setUsername("alice");
        customer.setEmail("alice@blumeo.test");
        customer.setPassword("customerpassword");
        customer.setRole(Role.CUSTOMER);
        customer = userRepository.save(customer);

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
        romanticRoses.setPrice(new BigDecimal("39.90"));
        romanticRoses.setImageUrl("https://example.com/images/romantic-roses.jpg");
        romanticRoses.getOccasions().add(Occasion.VALENTINES_DAY);
        romanticRoses.getOccasions().add(Occasion.ANNIVERSARY);

        bouquetRepository.save(romanticRoses);

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

        //Create test Rating
        Rating rating = new Rating();
        rating.setOrderId(1L);
        rating.setCustomerId(customer.getId());
        rating.setRatingScore(5);
        rating.setReview("Beautiful bouquet and fast delivery!");

        ratingRepository.save(rating);

        //Create test Order
        Order order = new Order();
        order.setCustomer(customer);
        order.setDeliveryAddress("123 Demo Street, Berlin");
        order.setStatus(OrderStatus.CREATED);

        order = orderRepository.save(order);

        OrderLine line1 = new OrderLine();
        line1.setOrder(order);
        line1.setBouquet(romanticRoses);
        line1.setQuantity(1);
        line1.setPrice(romanticRoses.getPrice());

        OrderLine line2 = new OrderLine();
        line2.setOrder(order);
        line2.setBouquet(customSpring);
        line2.setQuantity(2);
        line2.setPrice(customSpring.getPrice());

        orderLineRepository.save(line1);
        orderLineRepository.save(line2);

        double total =
                romanticRoses.getPrice().doubleValue() * line1.getQuantity() +
                customSpring.getPrice().doubleValue() * line2.getQuantity();

        order.setTotalAmount(total);
        orderRepository.save(order);
    }
}


