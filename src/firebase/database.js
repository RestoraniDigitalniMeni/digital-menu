import {
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue,
  query,
  orderByChild,
  equalTo
} from "firebase/database";

import { db } from "./config";

// Restaurant

export async function getRestaurant(restaurantId) {
  const snapshot = await get(
    ref(db, `restaurants/${restaurantId}`)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: restaurantId,
    ...snapshot.val()
  };
}

// Restaurant by owner

export async function getRestaurantByOwnerId(ownerId) {
  const restaurantsRef = ref(db, "restaurants");

  const restaurantQuery = query(
    restaurantsRef,
    orderByChild("ownerId"),
    equalTo(ownerId)
  );

  const snapshot = await get(restaurantQuery);

  if (!snapshot.exists()) {
    return null;
  }

  const restaurants = snapshot.val();

  const [restaurantId, restaurantData] =
    Object.entries(restaurants)[0];

  return {
    id: restaurantId,
    ...restaurantData
  };
}



// Categories

export async function getCategories(restaurantId) {
  const snapshot = await get(
    ref(db, `restaurants/${restaurantId}/categories`)
  );

  if (!snapshot.exists()) {
    return [];
  }

  return Object.entries(snapshot.val())
    .map(([id, category]) => ({
      id,
      ...category
    }))
    .sort(
      (a, b) =>
        (a.order || 0) - (b.order || 0)
    );
}

export async function addCategory(
  restaurantId,
  category
) {
  const categoriesRef = ref(
    db,
    `restaurants/${restaurantId}/categories`
  );

  const newCategoryRef = push(categoriesRef);

  await set(newCategoryRef, {
    name: category.name,
    order: category.order || 0
  });

  return newCategoryRef.key;
}

export async function updateCategory(
  restaurantId,
  categoryId,
  data
) {
  await update(
    ref(
      db,
      `restaurants/${restaurantId}/categories/${categoryId}`
    ),
    data
  );
}

export async function deleteCategory(
  restaurantId,
  categoryId
) {
  await remove(
    ref(
      db,
      `restaurants/${restaurantId}/categories/${categoryId}`
    )
  );
}

// Menu items

export async function addMenuItem(
  restaurantId,
  item
) {
  const itemsRef = ref(
    db,
    `restaurants/${restaurantId}/items`
  );

  const newItemRef = push(itemsRef);

  await set(newItemRef, {
    name: item.name,
    description: item.description || "",
    price: Number(item.price) || 0,
    categoryId: item.categoryId,
    image: item.image || "",
    available: item.available !== false
  });

  return newItemRef.key;
}

export async function updateMenuItem(
  restaurantId,
  itemId,
  data
) {
  await update(
    ref(
      db,
      `restaurants/${restaurantId}/items/${itemId}`
    ),
    data
  );
}

export async function deleteMenuItem(
  restaurantId,
  itemId
) {
  await remove(
    ref(
      db,
      `restaurants/${restaurantId}/items/${itemId}`
    )
  );
}




 


// Real-time restaurant listener

export function subscribeToRestaurant(
  restaurantId,
  callback
) {
  const restaurantRef = ref(
    db,
    `restaurants/${restaurantId}`
  );

  return onValue(restaurantRef, snapshot => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback({
      id: restaurantId,
      ...snapshot.val()
    });
  });
}

export async function getAllRestaurants() {

  const snapshot = await get(
    ref(db, "restaurants")
  );

  if (!snapshot.exists()) {
    return [];
  }

  return Object.entries(
    snapshot.val()
  ).map(([id, data]) => ({
    id,
    ...data
  }));

}

export async function createRestaurant(
  restaurantId,
  data
) {

  await set(
    ref(
      db,
      `restaurants/${restaurantId}`
    ),
    {
      name: data.name || "",
      description: data.description || "",
      logo: data.logo || "",
      phone: data.phone || "",
      address: data.address || "",
      email: data.email || "",
      instagram: data.instagram || "",
      ownerId: data.ownerId || "",
      menuDesign: data.menuDesign || "classic",
      createdAt: Date.now()
    }
  );

}
export async function updateRestaurant(
  restaurantId,
  data
) {
  await update(
    ref(
      db,
      `restaurants/${restaurantId}`
    ),
    {
      name: data.name || "",
      description: data.description || "",
      logo: data.logo || "",
      phone: data.phone || "",
      address: data.address || "",
      email: data.email || "",
      instagram: data.instagram || "",
      menuDesign: data.menuDesign || "classic"
    }
  );
}

export async function getAllUsers() {
  const snapshot = await get(
    ref(db, "users")
  );

  if (!snapshot.exists()) {
    return [];
  }

  return Object.entries(snapshot.val()).map(
    ([id, data]) => ({
      id,
      ...data
    })
  );
}


export async function updateUser(
  userId,
  data
) {

  await update(
    ref(
      db,
      `users/${userId}`
    ),
    {
      name: data.name || "",
      role: data.role || "user"
    }
  );

}