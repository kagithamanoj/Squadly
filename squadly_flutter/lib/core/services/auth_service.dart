import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  
  Map<String, dynamic>? _user;
  bool _isLoading = false;
  String? _error;
  
  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  
  // Initialize - Check if user is already logged in
  Future<void> init() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token != null) {
        await loadUserProfile();
      }
    } catch (e) {
      debugPrint('Init error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Load user profile
  Future<void> loadUserProfile() async {
    try {
      final response = await _apiService.getUserProfile();
      _user = response.data;
      _error = null;
      notifyListeners();
    } catch (e) {
      debugPrint('Load profile error: $e');
      await logout();
    }
  }
  
  // Email/Password Login
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await _apiService.login(email, password);
      await _handleAuthResponse(response.data);
      return true;
    } catch (e) {
      _error = 'Login failed. Please check your credentials.';
      debugPrint('Login error: $e');
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Email/Password Signup
  Future<bool> signup(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await _apiService.signup(name, email, password);
      await _handleAuthResponse(response.data);
      return true;
    } catch (e) {
      _error = 'Signup failed. Please try again.';
      debugPrint('Signup error: $e');
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Google Sign-In
  Future<bool> signInWithGoogle() async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        _isLoading = false;
        notifyListeners();
        return false;
      }
      
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final response = await _apiService.googleAuth(googleAuth.idToken!);
      await _handleAuthResponse(response.data);
      return true;
    } catch (e) {
      _error = 'Google sign-in failed. Please try again.';
      debugPrint('Google sign-in error: $e');
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Handle authentication response
  Future<void> _handleAuthResponse(Map<String, dynamic> data) async {
    final token = data['token'];
    if (token != null) {
      await _storage.write(key: 'auth_token', value: token);
    }
    
    _user = {
      '_id': data['_id'],
      'name': data['name'],
      'email': data['email'],
      'avatar': data['avatar'],
    };
  }
  
  // Logout
  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
    await _googleSignIn.signOut();
    _user = null;
    _error = null;
    notifyListeners();
  }
  
  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
