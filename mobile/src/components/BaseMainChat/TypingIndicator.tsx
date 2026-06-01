import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(dot1, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(dot2, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(dot3, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(dot1, { toValue: 0, duration: 250, useNativeDriver: true }),
                Animated.timing(dot2, { toValue: 0, duration: 250, useNativeDriver: true }),
                Animated.timing(dot3, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start(() => animate());
        };
        animate();
    }, [dot1, dot2, dot3]);

    const translateY = (anim: Animated.Value) => anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -5]
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.dot, { transform: [{ translateY: translateY(dot1) }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: translateY(dot2) }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: translateY(dot3) }] }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 10,
        height: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.textSecondary,
        marginHorizontal: 3,
    }
});
