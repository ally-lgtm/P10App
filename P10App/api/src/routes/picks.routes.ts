import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const mapDbPickToApi = (row: any) => ({
  pickId: row.pick_id,
  userId: row.user_id,
  leagueId: row.league_id,
  raceId: row.race_id,
  p10DriverId: row.p10_driver_id,
  firstRetirementDriverId: row.first_retirement_driver_id,
  fastestLapDriverId: row.fastest_lap_driver_id,
  submittedAt: row.submitted_at,
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, leagueId, raceId } = req.query;
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
    const offset = parseInt((req.query.offset as string) || '0', 10);

    if (Number.isNaN(limit) || limit < 1 || limit > 100 || Number.isNaN(offset) || offset < 0) {
      return res.status(400).json({
        code: 'INVALID_QUERY_PARAMS',
        message: 'Invalid pagination parameters',
        details: { limit, offset },
      });
    }

    let query = supabase.from('picks').select('*', { count: 'exact' });

    if (userId) {
      query = query.eq('user_id', userId as string);
    }
    if (leagueId) {
      query = query.eq('league_id', leagueId as string);
    }
    if (raceId) {
      query = query.eq('race_id', raceId as string);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      return next(error);
    }

    res.status(200).json({
      items: (data || []).map(mapDbPickToApi),
      total: count ?? 0,
      limit,
      offset,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      userId,
      leagueId,
      raceId,
      p10DriverId,
      firstRetirementDriverId,
      fastestLapDriverId,
    } = req.body || {};

    if (!userId || !leagueId || !raceId) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'userId, leagueId, and raceId are required',
        details: { userId, leagueId, raceId },
      });
    }

    const { data, error } = await supabase
      .from('picks')
      .insert({
        user_id: userId,
        league_id: leagueId,
        race_id: raceId,
        p10_driver_id: p10DriverId ?? null,
        first_retirement_driver_id: firstRetirementDriverId ?? null,
        fastest_lap_driver_id: fastestLapDriverId ?? null,
      })
      .select('*')
      .single();

    if (error) {
      if ((error as any).code === '23505') {
        return res.status(409).json({
          code: 'PICK_ALREADY_EXISTS',
          message: 'A pick already exists for this user, league, and race.',
          details: null,
        });
      }
      return next(error);
    }

    const pick = mapDbPickToApi(data);
    res.status(201)
      .location(`/picks/${pick.pickId}`)
      .json(pick);
  } catch (err) {
    next(err);
  }
});

router.get('/:pickId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pickId } = req.params;

    const { data, error } = await supabase
      .from('picks')
      .select('*')
      .eq('pick_id', pickId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          code: 'NOT_FOUND',
          message: 'Pick not found',
          details: null,
        });
      }
      return next(error);
    }

    res.status(200).json(mapDbPickToApi(data));
  } catch (err) {
    next(err);
  }
});

router.put('/:pickId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pickId } = req.params;
    const {
      userId,
      leagueId,
      raceId,
      p10DriverId,
      firstRetirementDriverId,
      fastestLapDriverId,
    } = req.body || {};

    if (!userId || !leagueId || !raceId) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'userId, leagueId, and raceId are required for PUT',
        details: { userId, leagueId, raceId },
      });
    }

    const { data, error } = await supabase
      .from('picks')
      .update({
        user_id: userId,
        league_id: leagueId,
        race_id: raceId,
        p10_driver_id: p10DriverId ?? null,
        first_retirement_driver_id: firstRetirementDriverId ?? null,
        fastest_lap_driver_id: fastestLapDriverId ?? null,
      })
      .eq('pick_id', pickId)
      .select('*')
      .single();

    if (error) {
      if ((error as any).code === '23505') {
        return res.status(409).json({
          code: 'PICK_ALREADY_EXISTS',
          message: 'Update would violate the uniqueness constraint for this user, league, and race.',
          details: null,
        });
      }
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          code: 'NOT_FOUND',
          message: 'Pick not found',
          details: null,
        });
      }
      return next(error);
    }

    res.status(200).json(mapDbPickToApi(data));
  } catch (err) {
    next(err);
  }
});

router.patch('/:pickId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pickId } = req.params;
    const {
      userId,
      leagueId,
      raceId,
      p10DriverId,
      firstRetirementDriverId,
      fastestLapDriverId,
    } = req.body || {};

    const updatePayload: any = {};

    if (userId !== undefined) updatePayload.user_id = userId;
    if (leagueId !== undefined) updatePayload.league_id = leagueId;
    if (raceId !== undefined) updatePayload.race_id = raceId;
    if (p10DriverId !== undefined) updatePayload.p10_driver_id = p10DriverId;
    if (firstRetirementDriverId !== undefined) updatePayload.first_retirement_driver_id = firstRetirementDriverId;
    if (fastestLapDriverId !== undefined) updatePayload.fastest_lap_driver_id = fastestLapDriverId;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'At least one field must be provided for PATCH',
        details: null,
      });
    }

    const { data, error } = await supabase
      .from('picks')
      .update(updatePayload)
      .eq('pick_id', pickId)
      .select('*')
      .single();

    if (error) {
      if ((error as any).code === '23505') {
        return res.status(409).json({
          code: 'PICK_ALREADY_EXISTS',
          message: 'Update would violate the uniqueness constraint for this user, league, and race.',
          details: null,
        });
      }
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          code: 'NOT_FOUND',
          message: 'Pick not found',
          details: null,
        });
      }
      return next(error);
    }

    res.status(200).json(mapDbPickToApi(data));
  } catch (err) {
    next(err);
  }
});

router.delete('/:pickId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pickId } = req.params;

    const { error, count } = await supabase
      .from('picks')
      .delete({ count: 'exact' })
      .eq('pick_id', pickId);

    if (error) {
      return next(error);
    }

    if (!count) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Pick not found',
        details: null,
      });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
