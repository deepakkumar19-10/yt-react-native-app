//=====================//
//Flat-List        //
//===================//

import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const dummy = [
  {
    id: 1,
    name: 'Deepak',
    email: 'deepak123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    name: 'Rahul',
    email: 'rahul123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    name: 'Amit',
    email: 'amit123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    name: 'Rohit',
    email: 'rohit123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 5,
    name: 'Vikas',
    email: 'vikas123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 6,
    name: 'Ankit',
    email: 'ankit123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 7,
    name: 'Mohit',
    email: 'mohit123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 8,
    name: 'Karan',
    email: 'karan123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 9,
    name: 'Nikhil',
    email: 'nikhil123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 10,
    name: 'Sandeep',
    email: 'sandeep123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 11,
    name: 'Arjun',
    email: 'arjun123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 12,
    name: 'Akash',
    email: 'akash123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 13,
    name: 'Manish',
    email: 'manish123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 14,
    name: 'Sumit',
    email: 'sumit123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 15,
    name: 'Harsh',
    email: 'harsh123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 16,
    name: 'Piyush',
    email: 'piyush123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 17,
    name: 'Yash',
    email: 'yash123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 18,
    name: 'Varun',
    email: 'varun123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 19,
    name: 'Ravi',
    email: 'ravi123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 20,
    name: 'Ajay',
    email: 'ajay123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 21,
    name: 'Vivek',
    email: 'vivek123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 22,
    name: 'Shubham',
    email: 'shubham123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 23,
    name: 'Tarun',
    email: 'tarun123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 24,
    name: 'Gaurav',
    email: 'gaurav123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 25,
    name: 'Dev',
    email: 'dev123@gmail.com',
    image:
      'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
  },
];

const MyFlatList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummy}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              style={styles.image}
              source={{
                uri: 'https://images.unsplash.com/photo-1788438868315-42d573e3b87f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D',
              }}
            />

            <Text>Naam</Text>
            <Text>Instagram</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={<View style={{ height: 10 }} />}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        // ExtraData{}, horizontal,
      />
    </View>
  );
};

export default MyFlatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dadada',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  card: {
    width: 200,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});
