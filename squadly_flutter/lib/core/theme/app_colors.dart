import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors - Orange Gradient
  static const Color primary = Color(0xFFFF6B35);
  static const Color primaryDark = Color(0xFFFF5722);
  static const Color primaryLight = Color(0xFFFF8C42);
  
  // Secondary Colors
  static const Color secondary = Color(0xFF8B5CF6); // Purple
  static const Color secondaryLight = Color(0xFFA78BFA);
  
  // Accent Colors
  static const Color accent = Color(0xFF14B8A6); // Teal
  static const Color accentLight = Color(0xFF2DD4BF);
  
  // Neutral Colors
  static const Color dark = Color(0xFF1F2937);
  static const Color darkSecondary = Color(0xFF374151);
  static const Color light = Color(0xFFF9FAFB);
  static const Color lightSecondary = Color(0xFFF3F4F6);
  
  // Text Colors
  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textTertiary = Color(0xFF9CA3AF);
  
  // Background Colors
  static const Color background = Color(0xFFFFFFFF);
  static const Color backgroundSecondary = Color(0xFFF9FAFB);
  static const Color surface = Color(0xFFFFFFFF);
  
  // Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);
  
  // Glassmorphism
  static const Color glassSurface = Color(0x33FFFFFF);
  static const Color glassBorder = Color(0x1AFFFFFF);
  
  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient purpleGradient = LinearGradient(
    colors: [secondary, secondaryLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient tealGradient = LinearGradient(
    colors: [accent, accentLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
