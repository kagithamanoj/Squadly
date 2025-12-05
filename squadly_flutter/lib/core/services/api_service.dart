import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5001/api';
  
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
    
    // Add interceptor for authentication
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'auth_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            // Token expired, redirect to login
            await _storage.delete(key: 'auth_token');
          }
          return handler.next(error);
        },
      ),
    );
  }
  
  // Auth Endpoints
  Future<Response> login(String email, String password) {
    return _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
  }
  
  Future<Response> signup(String name, String email, String password) {
    return _dio.post('/auth/signup', data: {
      'name': name,
      'email': email,
      'password': password,
    });
  }
  
  Future<Response> googleAuth(String token) {
    return _dio.post('/auth/google', data: {
      'token': token,
    });
  }
  
  Future<Response> getUserProfile() {
    return _dio.get('/users/profile');
  }
  
  // Trip Endpoints
  Future<Response> getTrips() {
    return _dio.get('/trips');
  }
  
  Future<Response> getTripDetails(String tripId) {
    return _dio.get('/trips/$tripId');
  }
  
  Future<Response> createTrip(Map<String, dynamic> tripData) {
    return _dio.post('/trips', data: tripData);
  }
  
  Future<Response> generateTripPass(String tripId) {
    return _dio.post('/trips/$tripId/generate-pass');
  }
  
  Future<Response> joinTrip(String passCode) {
    return _dio.post('/trips/join/$passCode');
  }
  
  // Expense Endpoints
  Future<Response> getExpenses(String tripId) {
    return _dio.get('/expenses/$tripId');
  }
  
  Future<Response> addExpense(Map<String, dynamic> expenseData) {
    return _dio.post('/expenses', data: expenseData);
  }
  
  // Social Endpoints
  Future<Response> searchUsers(String query) {
    return _dio.get('/users/search', queryParameters: {'query': query});
  }
  
  Future<Response> sendFriendRequest(String userId) {
    return _dio.post('/users/friend-request/$userId');
  }
  
  Future<Response> acceptFriendRequest(String requestId) {
    return _dio.put('/users/friend-request/$requestId/accept');
  }
  
  Future<Response> rejectFriendRequest(String requestId) {
    return _dio.put('/users/friend-request/$requestId/reject');
  }
  
  Future<Response> getFriends() {
    return _dio.get('/users/friends');
  }
  
  Future<Response> getFriendRequests() {
    return _dio.get('/users/friend-requests');
  }
  
  // Dashboard Endpoints
  Future<Response> getDashboardStats() {
    return _dio.get('/dashboard/stats');
  }
}
