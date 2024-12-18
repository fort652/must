import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import formatCategoryName from '../components/formatCategoryName';

interface Item {
  count: number;
  price: number;
  gift?: number;
}

interface Trade {
  name: string;
  count: number;
  amount: number;
}

interface Submission {
  timestamp: string;
  items: Record<string, Record<string, Item>>;
  discount: number;
  trades?: Trade[];
}

const SubmittedDataPage: React.FC = () => {
  const [groupedSubmissions, setGroupedSubmissions] = useState<
    Record<string, Submission[]>
  >({});
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    loadSubmittedData();
  }, []);

  const loadSubmittedData = async () => {
    try {
      const data = await AsyncStorage.getItem('submittedData');
      const submissions: Submission[] = data ? JSON.parse(data) : [];

      // Group submissions by date in "day month year" format
      const grouped = submissions.reduce<Record<string, Submission[]>>(
        (acc, submission) => {
          const date = new Date(submission.timestamp).toLocaleDateString(
            'en-US',
            {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            },
          );
          if (!acc[date]) acc[date] = [];
          acc[date].push(submission);
          return acc;
        },
        {},
      );

      setGroupedSubmissions(grouped);

      // Calculate grand total
      const total = submissions.reduce((sum, submission) => {
        return (
          sum +
          calculateTotalAmount(
            submission.items,
            submission.discount,
            submission.trades || [],
          )
        );
      }, 0);

      setGrandTotal(total);
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('submittedData');
      setGroupedSubmissions({});
      setGrandTotal(0);
      Alert.alert('Success', 'Data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const calculateTotalAmount = (
    items: Record<string, Record<string, Item>>,
    discount: number,
    trades: Trade[] = [],
  ): number => {
    let total = 0;
    for (const category of Object.values(items)) {
      for (const itemData of Object.values(category)) {
        total += itemData.count * itemData.price;
      }
    }

    const tradeTotal = trades.reduce(
      (sum, trade) => sum + trade.amount * trade.count,
      0,
    );

    return total - discount - tradeTotal;
  };

  const calculateDateTotal = (submissions: Submission[]): number => {
    return submissions.reduce((sum, submission) => {
      return (
        sum +
        calculateTotalAmount(
          submission.items,
          submission.discount,
          submission.trades || [],
        )
      );
    }, 0);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Grand Total: R{grandTotal}</Text>

      {/* Clear Storage Button */}
      <View style={styles.clearButtonContainer}>
        <Button
          title='Clear Data "Only for testing"'
          color='#AC415B'
          onPress={() => {
            Alert.alert(
              'Clear Storage',
              'Are you sure you want to clear all data?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: clearStorage },
              ],
            );
          }}
        />
      </View>

      {Object.keys(groupedSubmissions).length > 0 ? (
        Object.entries(groupedSubmissions).map(([date, submissions]) => (
          <View key={date} style={styles.dateGroup}>
            <View style={styles.dateHeader}>
              <Text style={styles.headerText}>{date}</Text>
              <Text style={styles.headerText}>
                Total: R{calculateDateTotal(submissions)}
              </Text>
            </View>

            {submissions.map((submission, index) => (
              <View key={index} style={styles.submissionContainer}>
                <Text style={styles.timestamp}>
                  Time:{' '}
                  {new Date(submission.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {Object.entries(submission.items).map(
                  ([categoryKey, items]) => (
                    <View key={categoryKey} style={styles.categoryContainer}>
                      <Text style={styles.categoryTitle}>
                        {formatCategoryName(categoryKey)}
                      </Text>
                      {Object.entries(items).map(([itemKey, itemData]) => (
                        <View key={itemKey} style={styles.itemContainer}>
                          <Text style={styles.itemName}>
                            {itemKey}: {itemData.count} - R
                            {itemData.count * itemData.price}
                          </Text>
                          {itemData.gift && itemData.gift > 0 && (
                            <Text style={styles.itemGift}>
                              Gifts: {itemData.gift}
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  ),
                )}

                {/* Display trades */}
                {(submission.trades || []).length > 0 && (
                  <View style={styles.tradesContainer}>
                    <Text style={styles.tradesTitle}>Trades:</Text>
                    {(submission.trades || []).map((trade, tradeIndex) => (
                      <Text key={tradeIndex} style={styles.tradeItem}>
                        {trade.name} - R{trade.count * trade.amount}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Display discount */}
                {submission.discount > 0 && (
                  <Text style={styles.discount}>
                    Discount: R{submission.discount}
                  </Text>
                )}

                {/* Display sale total */}
                <Text style={styles.saleTotal}>
                  Sale Total: R
                  {calculateTotalAmount(
                    submission.items,
                    submission.discount,
                    submission.trades || [],
                  )}
                </Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No submitted data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6CA295',
  },
  clearButtonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    backgroundColor: '#6CA295',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    // Removed text styles from here
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    marginBottom: 15,
  },
  submissionContainer: {
    backgroundColor: '#B8D1CB',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  timestamp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryContainer: {
    marginTop: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemContainer: {
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 16,
    color: '#000',
  },
  itemGift: {
    fontSize: 14,
    color: '#777',
  },
  discount: {
    fontSize: 16,
    color: '#AC415B',
    marginTop: 10,
  },
  tradesContainer: {
    marginTop: 10,
  },
  tradesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tradeItem: {
    fontSize: 16,
    color: '#000',
  },
  saleTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
});

export default SubmittedDataPage;
